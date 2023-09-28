import { PlayerStorageDTO } from './PlayerStorageDTO'
import { playersGetByGroup } from './playersGetByGroup'

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetByGroup(group)

    return storage.filter((player: PlayerStorageDTO) => player.team === team)
  } catch (error) {
    throw error
  }
}
