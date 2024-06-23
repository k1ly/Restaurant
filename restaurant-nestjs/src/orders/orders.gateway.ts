import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class OrdersGateway {
  @WebSocketServer()
  private server: Server;

  notifyManagers(statusName: string) {
    this.server.emit("orders", statusName);
  }
}
