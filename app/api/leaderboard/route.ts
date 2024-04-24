import { addScore, getSortedScores } from "../redis"

export interface Scores {
    name:string,
    score:number
  }

export async function GET(){
    const scores = await getSortedScores()
    return Response.json(scores)
}

export async function POST(request:Request){
    const {name,score} = await request.json()
    await addScore(name,score)

    const scores = await getSortedScores()

    return Response.json(scores)
}