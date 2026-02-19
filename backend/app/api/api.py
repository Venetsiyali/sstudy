from app.api.endpoints import login, users, rag, courses, learning_path

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(learning_path.router, prefix="/path", tags=["adaptive-path"])
