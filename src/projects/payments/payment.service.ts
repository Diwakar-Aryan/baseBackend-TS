import { HttpResponse } from "../../interfaces/http.response";
import configClass from "../../configs";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { HttpException } from "../../interfaces/http.exception";
import { MongoMethod } from "../../databases/mongo/method";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";

export default class PaymentService {
  config = configClass.initialize();
  public static instance: PaymentService;
  mongoMethods: MongoMethod;
  stripe = new Stripe(
    "pk_test_51ORUZoSCrku6xn0v3Wq5fCOqEZAxGYpoOewtwn5Q8Mh8SoO4DcG9i4OqMGTuKmFSBYwWqL51OvXDKE7H3Yqe2IKr00ZjVMiFxy"
  );

  private constructor() {
    this.mongoMethods = MongoMethod.initialize();
  }

  public static initialize() {
    if (!this.instance) {
      this.instance = new PaymentService();
    }
    return this.instance;
  }

  public async checkout(reqData: any) {
    try {
      let token = reqData.token;
      const customer = await this.stripe.customers.create({
        email: "dimesed963@usoplay.com",
        source: token.id,
      });
      await this.stripe.charges.create({
        amount: 1000,
        description: "Test Purchase",
        currency: "USD",
        customer: customer.id,
      });

      return new HttpResponse("", { success: true });
    } catch (error) {
      return new HttpException(401, `Errored out with: ${error}`);
    }
  }
}
