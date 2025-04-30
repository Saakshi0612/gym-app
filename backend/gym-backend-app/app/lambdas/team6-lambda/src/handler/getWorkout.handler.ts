import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { WorkoutController } from "../controllers/workout.controller";

export const getBookingHandler = 
async (event: APIGatewayProxyEvent, headers: Record<string, string>): Promise<APIGatewayProxyResult> => {
    try {
        const query = event.queryStringParameters || {};
        if(!query.id){
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: "Missing user id",
                    status: "error"
                })
            };
        }
        
        // Prepare request parameters
        const requestParams: any = {
            id: query.id
        };
        
        // Add optional parameters if they exist
        if (query.states) {
            requestParams.states = query.states.split(',');
        }
        
        if (query.startDate) {
            requestParams.startDate = query.startDate;
        }
        
        if (query.endDate) {
            requestParams.endDate = query.endDate;
        }
        
        const controller = new WorkoutController();
        const workouts = await controller.getWorkout(requestParams);
        console.info(`Found ${workouts.length} workouts`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                data: workouts,
                status: "success"
            })
        };

    } catch (error) {
        console.error("Error in getBookingHandler:", error);
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