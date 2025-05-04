import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { WorkoutController } from "../controllers/workout.controller";

export const cancelWorkoutHandler = 
async (event: APIGatewayProxyEvent, headers: Record<string, string>): Promise<APIGatewayProxyResult> => {
    try {
        // Get workout ID and client ID from query parameters
        const query = event.queryStringParameters || {};
        if(!query.id || !query.clientId){
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: "Missing workout id or client id",
                    status: "error"
                })
            };
        }
        
        const controller = new WorkoutController();
        const result = await controller.cancelWorkout({
            id: query.id,
            clientId: query.clientId
        });
        console.info("Workout cancelled:", result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: "Workout successfully cancelled",
                data: result,
                status: "success"
            })
        };

    } catch (error) {
        console.error("Error in cancelWorkoutHandler:", error);
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