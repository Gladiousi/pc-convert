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
import { reducerCompare, initialStateCompare } from "../utils/page";

const Compare: React.FC = () => {
  const { token, setToken, setActiveTab, powerScores, setPowerScores } = useTabStore();
  const { powerScores: fetchedPowerScores, sockets, errors, isLoading } = useComponentData(
    token,
    setToken,
    setActiveTab
  );
  const [state, dispatch] = useReducer(reducerCompare, initialStateCompare);

  useEffect(() => {
    if (fetchedPowerScores) {
      console.log("Compare: Setting powerScores =", fetchedPowerScores);
      setPowerScores(fetchedPowerScores);
    }
  }, [fetchedPowerScores, setPowerScores]);

  const pc1Errors = useMemo(
    () => (powerScores ? checkCompatibility(state.pc1, powerScores) : []),
    [state.pc1, powerScores]
  );
  const pc2Errors = useMemo(
    () => (powerScores ? checkCompatibility(state.pc2, powerScores) : []),
    [state.pc2, powerScores]
  );

  const handleCompare = async () => {
    console.log("handleCompare: Starting comparison", { pc1: state.pc1, pc2: state.pc2, powerScores });
    dispatch({ type: "SET_COMPARING", payload: true });

    const timeout = setTimeout(() => {
      console.error("handleCompare: Comparison timed out");
      dispatch({ type: "SET_ERRORS", payload: ["Время сравнения истекло"] });
      dispatch({ type: "SET_COMPARING", payload: false });
    }, 5000);

    try {
      if (!powerScores) {
        console.error("handleCompare: powerScores is null");
        dispatch({ type: "SET_ERRORS", payload: ["Данные о комплектующих не загружены"] });
        return;
      }

      dispatch({ type: "SET_ERRORS", payload: [] });
      dispatch({ type: "SET_RESULT", payload: null });

      console.log("handleCompare: Errors =", { pc1Errors, pc2Errors });

      if (pc1Errors.length > 0 || pc2Errors.length > 0) {
        dispatch({
          type: "SET_ERRORS",
          payload: [...pc1Errors.map((e) => `ПК 1: ${e}`), ...pc2Errors.map((e) => `ПК 2: ${e}`)],
        });
        return;
      }

      const pc1Power = calculatePower(state.pc1, powerScores);
      const pc2Power = calculatePower(state.pc2, powerScores);
      console.log("handleCompare: Powers =", { pc1Power, pc2Power });

      dispatch({ type: "SET_RESULT", payload: { pc1Power, pc2Power } });
    } catch (err: any) {
      console.error("handleCompare: Error =", err);
      dispatch({ type: "SET_ERRORS", payload: [`Ошибка при сравнении: ${err.message || "Неизвестная ошибка"}`] });
    } finally {
      clearTimeout(timeout);
      console.log("handleCompare: Finished");
      dispatch({ type: "SET_COMPARING", payload: false });
    }
  };

  return (
    <PageContainer className="space-y-10">
      <SectionHeading>Сравнение компьютеров</SectionHeading>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl text-center">
        Соберите два компьютера, учитывая совместимость комплектующих, и сравните их мощность!
      </p>
      <p className="text-sm sm:text-base lg:text-md text-gray-600 max-w-3xl text-center">
        Выберите сокет для того, чтобы сразу выбрать комплектуюище выбранного сокета и не ошибиться
      </p>
      <ErrorList errors={[...errors, ...state.localErrors]} />
      {isLoading ? (
        <div className="text-gray-600 text-sm sm:text-base text-center">Загрузка комплектующих...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-6xl">
          <div className="flex-1 w-full border-b lg:border-b-0 lg:border-r border-gray-200 pb-4 lg:pb-0 lg:pr-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 ">Компьютер 1</h2>
            <SocketSelector
              socket={state.pc1Socket}
              setSocket={(val) => dispatch({ type: "SET_PC1_SOCKET", payload: val })}
              sockets={sockets}
              label="Сокет ПК 1"
            />
            <PCConfigForm
              pc={state.pc1}
              setPc={(pc) => dispatch({ type: "SET_PC1", payload: pc })}
              powerScores={powerScores}
              socket={state.pc1Socket}
              label="Компьютер 1"
            />
          </div>
          <div className="flex-1 w-full space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 ">Компьютер 2</h2>
            <SocketSelector
              socket={state.pc2Socket}
              setSocket={(val) => dispatch({ type: "SET_PC2_SOCKET", payload: val })}
              sockets={sockets}
              label="Сокет ПК 2"
            />
            <PCConfigForm
              pc={state.pc2}
              setPc={(pc) => dispatch({ type: "SET_PC2", payload: pc })}
              powerScores={powerScores}
              socket={state.pc2Socket}
              label="Компьютер 2"
            />
          </div>
        </div>
      )}
      <GradientButton
        onClick={handleCompare}
        isLoading={isLoading || state.isComparing}
        aria-label="Сравнить сборки"
      >
        Сравнить
      </GradientButton>
      <ConfigResult pc1={state.pc1} pc2={state.pc2} result={state.result} powerScores={powerScores} />
    </PageContainer>
  );
};

export default memo(Compare);