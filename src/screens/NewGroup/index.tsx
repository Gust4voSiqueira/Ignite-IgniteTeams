import { useNavigation } from '@react-navigation/native'
import { Container, Content, Icon } from './styles'
import { Button, Input, Header, Highlight } from '@components/index'

export function NewGroup() {
  const navigation = useNavigation()

  function handleNew() {
    navigation.navigate('players', { group: 'Rocket' })
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title="Nova turma"
          subtitle="crie a turma para adicionar pessoas."
        />

        <Input placeholder="Nome da turma" />

        <Button title="Criar" style={{ marginTop: 20 }} onPress={handleNew} />
      </Content>
    </Container>
  )
}
