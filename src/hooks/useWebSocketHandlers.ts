import { useEffect } from "react";
import { useWebSocketStore } from "../store/websocketStore";
import type {
  SpinWheelResponsePayload,
  GetUserProfileResponsePayload,
  GetLatestDrawResponsePayload,
  DoubleTroubleStatusResponsePayload,
  UpdatedUserResponsePayload,
  AviatorDrawResultResponsePayload,
  AviatorCountdownResponsePayload,
} from "../libs/interfaces";
import { toast } from "./use-toast";
import {
  AVIATOR_COUNTDOWN_TIMER,
  MAX_NUMBER_DOUBLE_TROUBLE,
} from "@/libs/constants";

export const useWebSocketHandlers = () => {
  useEffect(() => {
    const handleDoubleTroubleStatus = (payload: unknown) => {
      const statusPayload = payload as DoubleTroubleStatusResponsePayload;
      if (statusPayload.success) {
        const current = statusPayload.data.current || null;
        const history = statusPayload.data.history || [];
        if (current) {
          useWebSocketStore
            .getState()
            .setDoubleTroubleHistory({ current, history });
          useWebSocketStore.getState().setDoubleTroubleUserHistory((prev) =>
            prev.map((t) => {
              if (t.status !== "pending") return t;
              const winNum = current.winningNumbers;
              switch (t.drawType) {
                case "Number":
                  return { ...t, status: t.number === winNum ? "win" : "loss" };
                case "Under":
                  return {
                    ...t,
                    status:
                      winNum < MAX_NUMBER_DOUBLE_TROUBLE / 2 ? "win" : "loss",
                  };
                case "Over":
                  return {
                    ...t,
                    status:
                      winNum > MAX_NUMBER_DOUBLE_TROUBLE / 2 ? "win" : "loss",
                  };
                case "Exact":
                  return {
                    ...t,
                    status:
                      winNum === MAX_NUMBER_DOUBLE_TROUBLE / 2 ? "win" : "loss",
                  };
                default:
                  return t;
              }
            })
          );
        } else {
          useWebSocketStore
            .getState()
            .setDoubleTroubleHistory({ current: null, history });
        }
      } else {
        useWebSocketStore
          .getState()
          .setDoubleTroubleHistory({ current: null, history: [] });
        useWebSocketStore
          .getState()
          .setErrorMessage(
            statusPayload.message || "Error fetching double trouble status"
          );
      }
    };

    const handleSpinWheelResponse = (payload: unknown) => {
      const spinWheelPayload = payload as SpinWheelResponsePayload;
      if (spinWheelPayload.success) {
        useWebSocketStore.getState().updateUserData(spinWheelPayload.data);
        if (spinWheelPayload.data.amount > 0) {
          toast({
            variant: "success",
            title: "Spin Wheel Result",
            description: `You won ${spinWheelPayload.data.amount} coins!`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Spin Wheel Result",
            description:
              spinWheelPayload.message || "Oops! Try again next time.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Spin Wheel Result",
          description: spinWheelPayload.message || "Oops! Try again.",
        });
        useWebSocketStore
          .getState()
          .setErrorMessage(spinWheelPayload.message || "Oops! Try again.");
      }
    };

    const handleUserProfileGet = (payload: unknown) => {
      const userProfilePayload = payload as GetUserProfileResponsePayload;
      if (userProfilePayload.success) {
        useWebSocketStore.getState().setUserProfile(userProfilePayload.data);
      } else {
        useWebSocketStore.getState().setUserProfile(null);
        useWebSocketStore
          .getState()
          .setErrorMessage(
            userProfilePayload.message || "Error fetching user profile"
          );
      }
    };

    const handleLatestDrawGet = (payload: unknown) => {
      const latestDrawPayload = payload as GetLatestDrawResponsePayload;
      if (latestDrawPayload.success) {
        useWebSocketStore.getState().setLatestDraw(latestDrawPayload.data);
      } else {
        useWebSocketStore.getState().setLatestDraw(null);
        useWebSocketStore
          .getState()
          .setErrorMessage(
            latestDrawPayload.message || "Error fetching latest draw"
          );
      }
    };

    useWebSocketStore
      .getState()
      .registerHandler("spinWheel_response", handleSpinWheelResponse);
    useWebSocketStore
      .getState()
      .registerHandler("userProfile_response", handleUserProfileGet);
    useWebSocketStore
      .getState()
      .registerHandler("latestDraw_response", handleLatestDrawGet);
    useWebSocketStore
      .getState()
      .registerHandler(
        "doubleTroubleStatus_response",
        handleDoubleTroubleStatus
      );
    useWebSocketStore
      .getState()
      .registerHandler("updatedUser_response", (payload) => {
        const updatedUserPayload = payload as UpdatedUserResponsePayload;
        if (updatedUserPayload.success) {
          console.log("Updated user:", updatedUserPayload.data.user);
          useWebSocketStore
            .getState()
            .updateUserData(updatedUserPayload.data.user);
        }
      });

    useWebSocketStore
      .getState()
      .registerHandler("aviatorDrawResult_response", (payload) => {
        const aviatorDrawPayload = payload as AviatorDrawResultResponsePayload;
        if (aviatorDrawPayload.success) {
          useWebSocketStore
            .getState()
            .setAviatorDrawResult(aviatorDrawPayload.data);
          // If we have pending bets, update them
          if (aviatorDrawPayload.data.status === "finished") {
            useWebSocketStore.getState().setUserHistoryAviatorBets((prev) =>
              prev.map((bet) =>
                bet.outcome === "pending"
                  ? {
                      ...bet,
                      outcome: "loss",
                      cashOutMultiplier:
                        aviatorDrawPayload.data.crashMultiplier ||
                        bet.cashOutMultiplier,
                    }
                  : bet
              )
            );

            useWebSocketStore
              .getState()
              .setAviatorDrawHistory((prev) => [
                ...prev,
                aviatorDrawPayload.data,
              ]);
          }
        } else {
          useWebSocketStore.getState().setAviatorDrawResult(null);
          useWebSocketStore
            .getState()
            .setErrorMessage(
              aviatorDrawPayload.message || "Error fetching aviator draw result"
            );
        }
      });

    useWebSocketStore
      .getState()
      .registerHandler("aviatorCountdown_response", (payload) => {
        const aviatorCountdownPayload =
          payload as AviatorCountdownResponsePayload;
        if (aviatorCountdownPayload.success) {
          useWebSocketStore
            .getState()
            .setAviatorCountdown(aviatorCountdownPayload.data);
        } else {
          useWebSocketStore
            .getState()
            .setAviatorCountdown({ countdown: AVIATOR_COUNTDOWN_TIMER });
          useWebSocketStore
            .getState()
            .setErrorMessage(
              aviatorCountdownPayload.message ||
                "Error fetching aviator countdown"
            );
        }
      });
    return () => {
      // Optionally unregister on cleanup if needed, but for global store, often not necessary
    };
  }, []);
};
