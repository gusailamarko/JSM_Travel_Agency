import { Header } from "../../../components"

const dashboard = () => {
  const user = {
    name: 'Mr. Jose',
  }

  return (
    <main className="dashboard wrapper">
      <Header title={`Welcome, ${user?.name ?? 'Guest'}`} description="Track activity, trends and popular destinations in real time"/>
    </main>
  )
}
export default dashboard