import Team from "../Team";
import Bowman from '../mainClasses/bowman';
import Vampire from "../mainClasses/vampire";
import turnAI from "../logicAI";

const bowman = new Bowman('bowman');
bowman.turn = 'player';
bowman.position = 3;

const vampire = new Vampire('vampire');
vampire.turn = 'AI';
vampire.position = 4;

Team.teams = [bowman, vampire];