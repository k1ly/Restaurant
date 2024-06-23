import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import { join } from "path";

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  async findAll(url: string) {
    const publicDirectory = this.configService.get("PUBLIC_DIRECTORY");
    const path = join(__dirname, "..", "..", publicDirectory, url);
    return fs.readdirSync(path);
  }

  async remove(url: string) {
    const publicDirectory = this.configService.get("PUBLIC_DIRECTORY");
    const path = join(__dirname, "..", "..", publicDirectory, url);
    if (fs.existsSync(path)) fs.unlinkSync(path);
  }
}
