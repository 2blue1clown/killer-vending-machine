import { Scores } from "@/app/api/leaderboard/route"
import { FormEventHandler, useState } from "react"

interface SaveScoreProps{
    scores:Scores[]
    setScores:(scores:Scores[])=>void
    score:number
}

export default function SaveScore({scores,setScores,score}:SaveScoreProps){ 
    const [submitted,setSubmitted] = useState(false)
    
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

  return (<>
      {submitted && <p>Score saved!</p>}
    {!submitted && <form className="flex flex-col items-center" onSubmit={saveScore}>
    <input type="text" className="w-10" name="name" placeholder="ID"></input>
    <button type="submit" className="border p-1 m-1 bg-none hover:bg-white">Save</button>
  </form>}
  </>

  )
}