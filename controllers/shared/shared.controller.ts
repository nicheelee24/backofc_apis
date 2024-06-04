import { checkInputError } from "../../utils";
import { SharedService } from "../../service/shared";


export const getPing = async (req: any, res: any, next: any) => {
  try {
    // Enable the below function to implement validation checks
    // checkInputError(req);
    const response = await SharedService.getPing();
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
export const addMember = async (req: any, res: any, next: any) => {
  try {
    // checkInputError(req);
    const response = await SharedService.addMember(req.body);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
