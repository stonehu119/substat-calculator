
import CharacterDropdown from './components/CharacterDropdown'
import Weapon from './components/Weapon'
import RelicSets from './components/RelicSets'
import StatsInputs from './components/StatsInputs'

function App() {

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-2 pt-6 pb-4">
      <div className="flex flex-col items-center w-full gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 text-center mt-0 drop-shadow-lg tracking-wide">
          Star Rail<br />Substat Counter
        </h1>
        <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <CharacterDropdown />
            <Weapon />
            <RelicSets />
            <StatsInputs />
          </div>
          {/* Output Placeholder */}
          <div className="mt-4 bg-gray-700 rounded p-4 text-center text-lg text-blue-300">
            [Calculated Rolls Output]
          </div>
        </div>
      </div>
      <footer className="mt-8 text-xs text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Substat Counter
      </footer>
    </div>
  );
}

export default App;
