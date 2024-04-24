import { Redis } from '@upstash/redis'

export const revalidate = 0 // disable cache

interface Score { 
    id:string,
    name:string,
    score:number
}

const redis = new Redis({
    url: process.env.NEXT_PUBLIC_REDIS_URL as string,
    token: process.env.NEXT_PUBLIC_REDIS_TOKEN as string,
  })


export async function getScores(){
    const scores =  await redis.lrange('leaderboard', 0, -1)
    return scores.map((score:string) => {
        const [name, scoreValue] = score.split(':')
        return {name, score:parseInt(scoreValue)}
    })
}

export async function getSortedScores(){
    const scores = await getScores()
    return scores.sort((a,b) => b.score - a.score)

}

export async function addScore(name:string,score:number){
    return await redis.lpush('leaderboard', `${name}:${score}`)
    
}