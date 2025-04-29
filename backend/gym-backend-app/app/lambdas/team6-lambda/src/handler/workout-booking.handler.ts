import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { WorkoutController } from "../controllers/workout.controller";

export const workoutBookingHandler = 
async (event: APIGatewayProxyEvent, headers: Record<string, string>): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    message: "Missing request body",
                    status: "error"
                })
            };
        }

        const body = JSON.parse(event.body);
        const controller = new WorkoutController();
        const workoutBookingData = await controller.bookWorkout(body);
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

