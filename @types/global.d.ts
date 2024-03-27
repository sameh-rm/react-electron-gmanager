declare global {
  interface Window {
    db: string; // Assuming db is of type any
  }


}

declare namespace Express {
  export interface Request {
    user?: import("@prisma/client").User;
  }
}
