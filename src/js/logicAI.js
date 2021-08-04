import gameState from "./gameState";
import { calcPossiblePositions } from "./utils";
import Team from "./Team";
import TeamSeparate from "./TeamSeparate";

const teamAI = new TeamSeparate(Team.findTeam('AI'));
const teamPlayer = new TeamSeparate(Team.findTeam('player'));

const defender = teamAI.findHighestPropChar('defence');
const attacker = teamAI.findHighestPropChar('attack');
const target = teamPlayer.findLowestPropChar('defence');
