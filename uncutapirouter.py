from fastapi import APIRouter
from app.v1.endpoints import receipt

router = APIRouter()

router.include_router(
    receipt.router,
    prefix="/receipts",
    tags=["Receipts"]
)


# This file is the main entry point for the API router, which includes all the endpoints related to receipts.
# It uses FastAPI's APIRouter to organize the routes and tags them for better documentation.
# The `receipt` module is imported to include its routes under the `/receipts` prefix.
# This structure allows for better organization of the API and makes it easier to manage different endpoints related to receipts.
# The `tags` parameter is used to categorize the endpoints in the API documentation,
# making it easier for users to find and understand the available operations related to receipts.
# The `include_router` method is used to add the routes defined in the `receipt`
# module to the main API router, allowing for modular and maintainable code structure.
# The `APIRouter` instance is created to handle the routing of requests to the appropriate
# endpoints defined in the `receipt` module.    