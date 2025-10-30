import { Router } from "express";
import {login} from '../controladores/loginCtrl.js'

const router=Router();

router.get('/usuarios',login)
export default router