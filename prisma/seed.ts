import { prisma } from "../src/lib/prisma.js";
import "dotenv/config";
async function main(){

console.log("DATABASE_URL =", process.env.DATABASE_URL);

    await prisma.service.createMany({
        data:[
            {name:"Haircut",duration:30,price:30.4},
            {name:"Manicure",duration:45,price:40.4},
            {name:"Spa",duration:60,price:50}
        ]
    })
}
main().catch((e)=>{
    console.error(e);
    process.exit(1);
}).finally(async()=>{
    console.log("Loaded Given Data In The Database")
    await prisma.$disconnect();

})

