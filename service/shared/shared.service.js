import Services from "./services.js"
import { Apis, getDateTimeForToday, hashPassword, uploadBase64ImageToS3 } from "../../utils/index.js"
import { logger } from '../../utils/index.js'
import HttpStatus from "../../config/http-status.js"
import { getRedisValue, setRedisValue } from "../../middlewares/redis-communication.js"
// import dynamoDb from "../../utils/database"
import { getSignedUrlToViewObject } from "../../middlewares/bucket-upload.js"
import { MemberModel } from "../../models/member.model.js"
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
  async addMember(body) {
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
  async getMembers(query) {
    try {
      logger.info('Get Member started ');
      const queryAgg = []
      const queryCount = {}
      if(query.search) {
        const queryCond = {$or: [
          { username: new RegExp(query.searchText, 'i') },
          { agentname: new RegExp(query.searchText, 'i') }
        ]}
        queryAgg.push({
          $match: queryCond
        })
        queryCount.$or = queryCond.$or
      }
      if(query.userId) {
        queryAgg.push({
          $match: { userId: query.userId }
        })
        queryCount.userId = query.userId
      }
      queryAgg.push(
        { $skip: query.skip },
        { $limit: query.limit }
      )
      const memberFetched = await MemberModel.aggregate(queryAgg)
      const countMember = await MemberModel.countDocuments(queryCount)
      const totalPages = Math.ceil(countMember / query.limit);

      logger.info('Get Member completed');
      return this.success({ message: "Member Fetched successfully!!", statusCode: HttpStatus.ok, data: { memberDetails: memberFetched, totalPages }, totalCounts: countMember })
    } catch (error) {
      logger.error(`Error in Fetch Member`);
      throw error
    }
  }

}

export const SharedService = new SharedServiceClass
