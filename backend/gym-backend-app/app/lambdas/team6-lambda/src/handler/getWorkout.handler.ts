import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { WorkoutController } from "../controllers/workout.controller";

export const getBookingHandler = 
async (event: APIGatewayProxyEvent, headers: Record<string, string>): Promise<APIGatewayProxyResult> => {
    try {
       
        const query = event.queryStringParameters;
        if(!query.id){
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: "Missing id",
                    status: "error"
                })
            };
        }
        const controller = new WorkoutController();
        const workoutBookingData = await controller.getWorkout({id:query?.id});
        console.info(workoutBookingData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: workoutBookingData,
                status: "success"
            })
        };

    } catch (error) {
        console.error("Error in workoutBookingHandler:", error);
        if(error.type === "RESPONSE"){
            return {
                statusCode: error.statusCode,
                headers,
                body: JSON.stringify({
                    message: error.message,
                    status: "error"
                })
            };
        }
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: "Internal server error",
                status: "error"
            })
        };
    }
};


