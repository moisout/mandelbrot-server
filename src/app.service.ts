import { Injectable } from "@nestjs/common";
import { name, version, author, country } from "../package.json";
import { MandelbrotQuery } from "./query.interface";
import { Canvas } from "canvas";
import { createWriteStream } from "fs";

@Injectable()
export class AppService {
  canvasWidth: number;
  canvasHeight: number;
  iterations: number;
  maxX: number;
  minX: number;
  maxY: number;
  minY: number;

  getMandelbrot(query: MandelbrotQuery): string {
    this.canvasHeight = query.height;
    this.canvasWidth = query.width;
    this.iterations = query.iterations;
    this.maxX = query.maxX;
    this.minX = query.minX;
    this.maxY = query.maxY;
    this.minY = query.minY;

    return this.drawCanvas();
  }

  getCoordinatesFromPoints(pointX, pointY) {
    const canvasWidth = this.canvasWidth;
    const xCoordsWidth = this.maxX - this.minX;

    const canvasHeight = this.canvasHeight;
    const yCoordsHeight = this.maxY - this.minY;

    const coordX = (xCoordsWidth / canvasWidth) * pointX + this.minX;

    const coordY = this.maxY - (yCoordsHeight / canvasHeight) * pointY;

    return { coordX, coordY };
  }

  drawCanvas() {
    const canvas = new Canvas(this.canvasWidth, this.canvasHeight);
    const canvasHeight = this.canvasHeight;
    const canvasWidth = this.canvasWidth;
    const canvasContext = canvas.getContext("2d");
    for (let pointX = 0; pointX <= canvasWidth; pointX++) {
      for (let pointY = 0; pointY <= canvasHeight; pointY++) {
        const { coordX, coordY } = this.getCoordinatesFromPoints(
          pointX,
          pointY
        );

        const color = this.calculatePointColor(coordX, coordY, this.iterations);

        canvasContext.fillStyle = color;
        canvasContext.fillRect(pointX, pointY, 1, 1);
      }
    }
    const url = `${this.uuidv4()}.png`;
    const out = createWriteStream(__dirname, url),
      stream = canvas.createPNGStream();

    stream.on("data", (chunk) => {
      out.write(chunk);
    });
    return url;
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  calculatePointColor(c1: number, c2: number, iterations: number) {
    let zX: number = 0;
    let zY: number = 0;

    const duplicationArray = [];

    let hasDuplication = false;

    for (
      let index = 0;
      index < iterations && Math.abs(zX) <= 2 && Math.abs(zY) <= 2;
      index++
    ) {
      const oldZX = zX;
      zX = zX * zX - zY * zY + c1;
      zY = 2 * oldZX * zY + c2;

      if (
        duplicationArray.length > 0 &&
        duplicationArray.find((e) => e.zX === zX && e.zY === zY)
      ) {
        hasDuplication = true;
        break;
      }
      duplicationArray.push({ zX: zX, zY: zY });
    }

    if (hasDuplication || (Math.abs(zX) <= 2 && Math.abs(zY) <= 2)) {
      return "rgba(0,0,0,1)";
    }
    return "rgba(255,255,255,1)";
  }
}
