import { useEffect, useState, useRef } from 'react'
import { Alert, FlatList, TextInput } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import { Container, Form, HeaderList, NumberOfPlayers } from './styles'
import {
  Highlight,
  ButtonIcon,
  Input,
  Filter,
  PlayerCard,
  ListEmpty,
  Button,
  Header,
  Loading,
} from '@components/index'
import { AppError } from '@utils/AppError'
import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam'
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup'
import { groupRemoveByName } from '@storage/group/groupRemoveByName'

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const [team, setTeam] = useState('Time A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const [newPlayerName, setNewPlayerName] = useState('')

  const navigation = useNavigation()
  const route = useRoute()
  const { group } = route.params as RouteParams
  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddplayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert(
        'Nova pessoa',
        'Informe o nome da pessoa para adicionar.',
      )
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group)

      newPlayerNameInputRef.current?.blur()

      fetchPlayersByTeam()
      setNewPlayerName('')
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message)
      } else {
        console.log(error)
        Alert.alert('Nova pessoa', 'Não foi possível adicionar.')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true)
      const playersByTeam = await playersGetByGroupAndTeam(group, team)

      setPlayers(playersByTeam)
      setIsLoading(false)
    } catch (error) {
      Alert.alert(
        'Pessoas',
        'Não foi possivel carregar as pessoas do time selecionado.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()
    } catch (error) {
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.')
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      Alert.alert('Remover grupo', 'Não foi possível remover o grupo.')
    }
  }

  async function handleGroupRemove() {
    Alert.alert('Remover', 'Deseja remover a turma?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: () => groupRemove(),
      },
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="Adicione a galera e separe os times" />

      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={handleAddplayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddplayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item: PlayerStorageDTO) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas neste time." />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}
