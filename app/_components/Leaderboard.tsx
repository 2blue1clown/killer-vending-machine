import { FormEventHandler, useEffect, useState } from "react"
import { Scores } from "../api/leaderboard/route"


interface LeaderboardProps {
    scores:Scores[]
}

export default function  Leaderboard({scores}:LeaderboardProps){
   

    return  <>
    <table className="table-auto border border-black">
    <thead className="border border-black">
      <tr >
        <th className="border border-black" scope="col">Rank</th>
        <th className="border border-black" scope="col">Name</th>
        <th className="border border-black" scope="col">Score</th>
      </tr>
    </thead>
    <tbody >
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
  </>
}