import express from "express"
import axios from "axios";


const app = express()

async function getData() {
    console.log("sending request to fetch members from ",)
    const result = await axios.get("https://fitzone-gym-test.vercel.app/members")
    console.log("members are : ")
    console.log(result.data)
}
getData()