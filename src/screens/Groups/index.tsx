import { useState } from 'react'
import { FlatList } from 'react-native'
import { Container } from './styles'

import {
  ListEmpty,
  Button,
  GroupCard,
  Highlight,
  Header,
} from '@components/index'

export function Groups() {
  const [groups, setGroups] = useState<string[]>([])

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="Jogue com sua turma" />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={(item) => <GroupCard title={item.item} />}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => (
          <ListEmpty message="Que tal cadastrar a primeira turma?" />
        )}
      />

      <Button title="Criar nova turma" />
    </Container>
  )
}
