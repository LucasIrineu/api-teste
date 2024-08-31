import Measure from "../entities/Measure"
import { AppDataSource } from "../../database/data-source"

export const measureRepository = AppDataSource.getRepository(Measure)