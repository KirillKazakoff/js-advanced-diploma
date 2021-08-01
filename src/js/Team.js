import generateTeam from "./generators";

const teamPlayer = generateTeam(2, 2, 'player');
const teamAI = generateTeam(2, 2, 'AI');
const teams = [...teamPlayer, ...teamAI];

export default {
    teamAI, teamPlayer, teams
}
