import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { paymentsStatus, Prisma } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "src/config/config.service";
import { symulatePayment } from "./payment.utils";

@Injectable()
export class AccessService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async makePayment(data, req) {
    const { blik, amount } = data;
    if (blik.length !== 6 || !/^[0-9]{1,6}$/.test(blik)) {
      throw new HttpException("Bad blik code", HttpStatus.BAD_REQUEST);
    }

    const decode: any = jwt.verify(req.headers.token, this.config.jwtSecret);

    const newPayment = await this.prisma.payments.create({
      data: {
        user: { connect: { uid: decode.uid } },
        status: paymentsStatus.pending,
        amount,
      },
    });

    if (await symulatePayment()) {
      await this.prisma.payments.update({
        data: { status: paymentsStatus.done },
        where: { id: newPayment.id },
      });

      let endAccess = new Date();
      const lastEndAccess = await this.prisma.access.findMany({
        select: {
          endedAt: true,
        },
        where: {
          user: { uid: decode.uid },
        },
        orderBy: {
          endedAt: "desc",
        },
        take: 1,
      });

      if (lastEndAccess[0] && lastEndAccess[0].endedAt > endAccess) {
        endAccess = lastEndAccess[0].endedAt;
      }
      endAccess.setDate(endAccess.getDate() + 30);

      await this.prisma.access.create({
        data: {
          user: { connect: { uid: decode.uid } },
          payments: { connect: { id: newPayment.id } },
          endedAt: endAccess,
        },
      });

      return "Gratulacje. Wykupiłeś dostęp";
    } else {
      this.prisma.payments.update({
        data: { status: paymentsStatus.canceled },
        where: { id: newPayment.id },
      });

      throw new HttpException("payment error", HttpStatus.PAYMENT_REQUIRED);
    }
  }
}
