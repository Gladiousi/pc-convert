import { useReducer, useEffect, memo, useMemo } from "react";
import { useTabStore } from "../store/useTabStore";
import { checkCompatibility, calculatePower } from "../data/pcData";
import SocketSelector from "../components/compare/SocketSelector";
import PCConfigForm from "../components/compare/PCConfigForm";
import ConfigResult from "../components/compare/ConfigResult";
import PageContainer from "../components/common/PageContainer";
import SectionHeading from "../components/common/SectionHeading";
import GradientButton from "../components/common/GradientButton";
import ErrorList from "../components/common/ErrorList";
import { useComponentData } from "../hooks/useComponentData";
import { initialStateAssemble, reducerAssemble } from "../utils/page";

const Assemble: React.FC = () => {
  const { token, setToken, setActiveTab, powerScores, setPowerScores } = useTabStore();
  const { powerScores: fetchedPowerScores, sockets, errors, isLoading } = useComponentData(
    token,
    setToken,
    setActiveTab
  );
  const [state, dispatch] = useReducer(reducerAssemble, initialStateAssemble);

  useEffect(() => {
    if (fetchedPowerScores) {
      console.log("Assemble: Setting powerScores =", fetchedPowerScores);
      setPowerScores(fetchedPowerScores);
    }
  }, [fetchedPowerScores, setPowerScores]);

  const pcErrors = useMemo(
    () => (powerScores ? checkCompatibility(state.pc, powerScores) : []),
    [state.pc, powerScores]
  );

  const handleAssemble = async () => {
    console.log("handleAssemble: Starting calculation", { pc: state.pc, powerScores });
    dispatch({ type: "SET_CALCULATING", payload: true });

    const timeout = setTimeout(() => {
      console.error("handleAssemble: Calculation timed out");
      dispatch({ type: "SET_ERRORS", payload: ["Время расчёта истекло"] });
      dispatch({ type: "SET_CALCULATING", payload: false });
    }, 5000);

    try {
      if (!powerScores) {
        console.error("handleAssemble: powerScores is null");
        dispatch({ type: "SET_ERRORS", payload: ["Данные о комплектующих не загружены"] });
        return;
      }

      dispatch({ type: "SET_ERRORS", payload: [] });
      dispatch({ type: "SET_POWER", payload: null });

      console.log("handleAssemble: Compatibility errors =", pcErrors);

      if (pcErrors.length > 0) {
        dispatch({ type: "SET_ERRORS", payload: pcErrors });
        return;
      }

      const pcPower = calculatePower(state.pc, powerScores);
      console.log("handleAssemble: Calculated power =", pcPower);

      dispatch({ type: "SET_POWER", payload: pcPower });
    } catch (err: any) {
      console.error("handleAssemble: Error =", err);
      dispatch({ type: "SET_ERRORS", payload: [`Ошибка при расчёте мощности: ${err.message || "Неизвестная ошибка"}`] });
    } finally {
      clearTimeout(timeout);
      console.log("handleAssemble: Finished");
      dispatch({ type: "SET_CALCULATING", payload: false });
    }
  };

  return (
    <PageContainer className="space-y-10">
      <SectionHeading>Сборка ПК</SectionHeading>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl text-center">
        Соберите свой компьютер, учитывая совместимость комплектующих, и узнайте его мощность!
      </p>
      <p className="text-sm sm:text-base lg:text-md text-gray-600 max-w-3xl text-center">
        Выберите сокет для того, чтобы сразу выбрать комплектуюище выбранного сокета и не ошибиться
      </p>
      <ErrorList errors={[...errors, ...state.localErrors]} />
      {isLoading ? (
        <div className="text-gray-600 text-sm sm:text-base text-center">Загрузка комплектующих...</div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          <SocketSelector
            socket={state.socket}
            setSocket={(val) => dispatch({ type: "SET_SOCKET", payload: val })}
            sockets={sockets}
            label="Сокет"
          />
          <PCConfigForm
            pc={state.pc}
            setPc={(pc) => dispatch({ type: "SET_PC", payload: pc })}
            powerScores={powerScores}
            socket={state.socket}
            label="Ваш ПК"
          />
        </div>
      )}
      <GradientButton
        onClick={handleAssemble}
        isLoading={isLoading || state.isCalculating}
        aria-label="Рассчитать мощность сборки"
      >
        Рассчитать мощность
      </GradientButton>
      <ConfigResult
        pc1={state.pc}
        pc2={null}
        result={state.power ? { pc1Power: state.power, pc2Power: 0 } : null}
        powerScores={powerScores}
      />
    </PageContainer>
  );
};

export default memo(Assemble);