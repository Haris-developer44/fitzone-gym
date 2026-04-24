import express from "express"
import axios from "axios";


const app = express()

async function getData() {
    const result = await axios.get("https://fitzone-gym-test.vercel.app/members")
    console.log(result.data)
}
getData()