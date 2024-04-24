import { FormEventHandler, useEffect, useState } from "react"
import { Scores } from "../api/leaderboard/route"


interface LeaderboardProps {
    score:number
}

export default function  Leaderboard({score}:LeaderboardProps){

    const [scores,setScores] = useState<Scores[]>()
    const [submitted,setSubmitted] = useState(false)
   
    useEffect(() => {

        (async () => {const res = await fetch('/api/leaderboard',{method:'GET'})     
        const scores = await res.json()
        setScores(scores)
    })()},[])

    const saveScore:FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string

        if(!name) return
        if(name.length !== 3) return alert('Name must be 3 characters')
        
        if(scores && scores.findIndex((ele)=> ele.name === name && ele.score === score) !== -1) return alert('Score already saved')

        const res = await fetch('/api/leaderboard',{
            method:'POST',
            body:JSON.stringify({name,score})
        })
        const newScores = await res.json()
        setScores(newScores)
        setSubmitted(true)

    }


    return  <>
    <table className="table-auto border border-black">
    <caption>High Scores</caption>
    <thead className="border border-black">
      <tr >
        <th className="border border-black" scope="col">Rank</th>
        <th className="border border-black" scope="col">Name</th>
        <th className="border border-black" scope="col">Score</th>
      </tr>
    </thead>
    <tbody>
  {
!!scores && scores.sort((a, b) => b.score - a.score)
  .map((item, index) => (
    <tr className="border border-black" key={index}>
      <td className="border border-black">{index + 1}</td>
      <td className="border border-black">{item.name}</td>
      <td className="border border-black">{item.score}</td>
    </tr>
  ))
}
</tbody>
  </table>
    {submitted && <p>Score saved!</p>}
    {!submitted && <form onSubmit={saveScore}>
    <label htmlFor="name">Name</label>
    <input type="text" name="name" placeholder="Name"></input>
    <button type="submit">Save</button>
  </form>}

  </>
}