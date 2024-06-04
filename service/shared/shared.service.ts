import Services from "./services"
import { Apis, getDateTimeForToday, hashPassword, uploadBase64ImageToS3 } from "../../utils"
import { logger } from '../../utils'
import HttpStatus from "../../config/http-status"
import { getRedisValue, setRedisValue } from "../../middlewares/redis-communication"
// import dynamoDb from "../../utils/database"
import { getSignedUrlToViewObject } from "../../middlewares/bucket-upload"
import { MemberModel } from "../../models/member.model"
class SharedServiceClass extends Services {
  async getPing() {
    try {
      logger.info('Get Ping started');
      logger.info('Get Ping completed');
      return this.success({ message: "Ping api ran successfully!!", statusCode: HttpStatus.ok })
    } catch (error) {
      logger.error(`Error in getting ping`);
      throw error
    }
  }
  async addMember(body: any) {
    try {
      logger.info('Add Member started for ', body.userId);
      const password = hashPassword(body.password)
      const memberData = {
        accountType: body.accountType,
        userId: body.userId,
        username: body.username,
        prefix: body.prefix,
        clientApiSecret: body.clientApiSecret,
        platform: body.platform,
        percentage: body.percentage,
        pwd: body.pwd,
        parent: body.parent,
        agentname: body.agentname,
        agentId: body.agentId,
        url: body.url,
        callbackUrl: body.callbackUrl,
        sessionStartTime: getDateTimeForToday(),
        password,
      }
      const memberCreated = await MemberModel.create(memberData)

      logger.info('Add Member completed for ', body.userId);
      return this.success({ message: "Member Added successfully!!", statusCode: HttpStatus.ok })
    } catch (error) {
      logger.error(`Error in Add Member for ${body.userId}`);
      throw error
    }
  }

}

export const SharedService = new SharedServiceClass
