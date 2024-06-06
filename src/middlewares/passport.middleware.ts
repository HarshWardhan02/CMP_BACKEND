import * as pjtw from 'passport-jwt';
import config from 'config';
import userModel, { UserDocument } from '../models/user.model'; 

const opts:pjtw.StrategyOptions = {
    jwtFromRequest: pjtw.ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    secretOrKey: config.get("access_token_secrete_key"),
    passReqToCallback: true
};

export const strategy = new pjtw.Strategy(opts, async(req:any, jwt_Payload:any, done:any) => {
    try{
        const user:UserDocument | null = await userModel.findOne({userID: jwt_Payload.userID});
        if(user){
            req["clientID"] = jwt_Payload.clientID;
            done(null, user);
        }else{
            return done("", false);
        }
    }catch(err:any){
        return done(err, false);
    }
    
});

