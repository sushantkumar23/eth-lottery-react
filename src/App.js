import './App.css'
import React from 'react'
import lottery from './lottery'
import web3 from './web3'

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({ manager, players, balance })
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()
    this.setState({ message: 'Waiting on transaction...' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    })

    this.setState({ message: 'Yay! have been entered!' })
  }

  onClick = async (event) => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()
    this.setState({ message: 'Picking a winner...' })

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    this.setState({ message: 'Yay! Winner has been picked' })
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Lottery Contract
          </h2>
          <p className="text-gray-600">
            This contract is managed by&nbsp;
            <span className="font-bold">{this.state.manager}</span>
          </p>
          <p className="text-gray-600">
            There are currently {this.state.players.length} players and are
            competing to win {web3.utils.fromWei(this.state.balance, 'ether')}
            &nbsp;ether.
          </p>
        </div>
        <form className="mb-4" onSubmit={this.onSubmit}>
          <h4 className="mb-4 text-xl font-bold text-center">
            Want to try your luck?
          </h4>
          <div>
            <label htmlFor="amount" className="mb-2 text-gray-600">
              Ether amount
            </label>
            <input
              className="w-full px-4 py-2 mb-4 text-lg border border-gray-300 rounded focus:outline-none"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            ></input>
          </div>
          <button className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Enter
          </button>
        </form>
        <div>
          <h4 className="mb-4 text-xl font-bold text-center">
            Ready to pick a winner?
          </h4>
          <button
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            onClick={this.onClick}
          >
            Pick Winner
          </button>
        </div>

        <h4>{this.state.message}</h4>
      </div>
    )
  }
}
export default App
