import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class ReservationsGateway {
  @WebSocketServer()
  private server: Server;

  notifyManagers() {
    this.server.emit("reservations");
  }
}
