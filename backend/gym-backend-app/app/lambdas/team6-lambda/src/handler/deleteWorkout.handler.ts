import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { WorkoutController } from "../controllers/workout.controller";

export const deleteWorkoutHandler = 
async (event: APIGatewayProxyEvent, headers: Record<string, string>): Promise<APIGatewayProxyResult> => {
    try {
        // Get workout ID from query parameters
        const query = event.queryStringParameters || {};
        if(!query.id){
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: "Missing workout id",
                    status: "error"
                })
            };
        }
        
        const controller = new WorkoutController();
        const result = await controller.deleteWorkout({id: query.id});
        console.info("Workout deleted:", result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: "Workout successfully deleted",
                data: result,
                status: "success"
            })
        };

    } catch (error) {
        console.error("Error in deleteWorkoutHandler:", error);
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