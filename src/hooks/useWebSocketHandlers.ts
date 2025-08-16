import { useEffect } from "react";
import { useWebSocketStore } from "../store/websocketStore";
import type {
  LoginResponsePayload,
  GetTicketsResponsePayload,
  SpinWheelResponsePayload,
  GetLeaderboardResponsePayload,
  GetUserProfileResponsePayload,
  GetMegaPotResponsePayload,
  GetLatestDrawResponsePayload,
  CreateTicketResponsePayload,
  DoubleTroubleDrawResultPayload,
  CreateDoubleTroubleTicketResponsePayload,
  UpdatedUserResponsePayload,
  RegisterResponsePayload,
  AviatorDrawResultResponsePayload,
  AviatorCountdownResponsePayload,
  CashOutAviatorTicketResponsePayload,
} from "../libs/interfaces";
import { toast } from "./use-toast";
import { AVIATOR_COUNTDOWN_TIMER } from "@/libs/constants";

export const useWebSocketHandlers = () => {
  useEffect(() => {
    const handleLoginResponse = (payload: unknown) => {
      const loginPayload = payload as LoginResponsePayload;
      if (loginPayload.success) {
        useWebSocketStore
          .getState()
          .setUserData(loginPayload.data.user, loginPayload.data.token);
      } else {
        useWebSocketStore.getState().setUserData(null, null);
        useWebSocketStore
          .getState()
          .setErrorMessage(loginPayload.message || "Login failed");
      }
    };

    const handleRegisterResponse = (payload: unknown) => {
      const registerPayload = payload as RegisterResponsePayload;
      if (registerPayload.success) {
        useWebSocketStore
          .getState()
          .setUserData(registerPayload.data.user, registerPayload.data.token);
      } else {
        useWebSocketStore.getState().setUserData(null, null);
        useWebSocketStore
          .getState()
          .setErrorMessage(registerPayload.message || "Registration failed");
      }
    };

    const handleGoogleLoginResponse = (payload: unknown) => {
      const googleLoginPayload = payload as LoginResponsePayload;
      if (googleLoginPayload.success) {
        useWebSocketStore
          .getState()
          .setUserData(
            googleLoginPayload.data.user,
            googleLoginPayload.data.token
          );
      } else {
        useWebSocketStore.getState().setUserData(null, null);
        useWebSocketStore
          .getState()
          .setErrorMessage(googleLoginPayload.message || "Google login failed");
      }
    };

    const handleTicketGet = (payload: unknown) => {
      const ticketsPayload = payload as GetTicketsResponsePayload;
      if (ticketsPayload.success) {
        useWebSocketStore.getState().setTickets(ticketsPayload.data);
      } else {
        useWebSocketStore.getState().setTickets([]);
        useWebSocketStore
          .getState()
          .setErrorMessage(ticketsPayload.message || "Error fetching tickets");
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

    const handleLeaderboardGet = (payload: unknown) => {
      const leaderboardPayload = payload as GetLeaderboardResponsePayload;
      if (leaderboardPayload.success) {
        useWebSocketStore.getState().setLeaderboard(leaderboardPayload.data);
      } else {
        useWebSocketStore.getState().setLeaderboard([]);
        useWebSocketStore
          .getState()
          .setErrorMessage(
            leaderboardPayload.message || "Error fetching leaderboard"
          );
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

    const handleMegaPotGet = (payload: unknown) => {
      const megaPotPayload = payload as GetMegaPotResponsePayload;
      if (megaPotPayload.success) {
        useWebSocketStore.getState().setMegaPot(megaPotPayload.data);
      } else {
        useWebSocketStore.getState().setMegaPot(null);
        useWebSocketStore
          .getState()
          .setErrorMessage(megaPotPayload.message || "Error fetching mega pot");
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

    const handleCreateTicketResponse = (payload: unknown) => {
      const createTicketPayload = payload as CreateTicketResponsePayload;
      if (createTicketPayload.success) {
        toast({
          variant: "success",
          title: "Ticket Created",
          description: `Your ticket for ${createTicketPayload.data?.bid} coins has been successfully created!`,
        });
        if (createTicketPayload.data?.user) {
          useWebSocketStore
            .getState()
            .updateUserData(createTicketPayload.data.user);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Ticket Creation Failed",
          description: createTicketPayload.message,
        });
        useWebSocketStore
          .getState()
          .setErrorMessage(
            createTicketPayload.message || "Error creating ticket"
          );
      }
    };

    const handleDoubleTroubleDrawResult = (payload: unknown) => {
      const doubleTroublePayload = payload as DoubleTroubleDrawResultPayload;
      if (doubleTroublePayload.success) {
        useWebSocketStore
          .getState()
          .setDoubleTroubleDrawResult(doubleTroublePayload.data);
      } else {
        useWebSocketStore.getState().setDoubleTroubleDrawResult(null);
        useWebSocketStore
          .getState()
          .setErrorMessage(
            doubleTroublePayload.message ||
              "Error fetching double trouble draw result"
          );
      }
    };

    const handleCreateDoubleTroubleTicketResponse = (payload: unknown) => {
      const createTicketPayload =
        payload as CreateDoubleTroubleTicketResponsePayload;
      if (createTicketPayload.success) {
        toast({
          variant: "success",
          title: "Double Trouble Ticket Created",
          description: `Your bet ${createTicketPayload.data?.ticket.bidAmount} coins has Made`,
        });
        if (createTicketPayload.data?.user) {
          useWebSocketStore
            .getState()
            .updateUserData(createTicketPayload.data.user);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Double Trouble Ticket Creation Failed",
          description: createTicketPayload.message,
        });
        useWebSocketStore
          .getState()
          .setErrorMessage(
            createTicketPayload.message ||
              "Error creating double trouble ticket"
          );
      }
    };

    useWebSocketStore
      .getState()
      .registerHandler("login_response", handleLoginResponse);
    useWebSocketStore
      .getState()
      .registerHandler("register_response", handleRegisterResponse);
    useWebSocketStore
      .getState()
      .registerHandler("googleLogin_response", handleGoogleLoginResponse);
    useWebSocketStore
      .getState()
      .registerHandler("spinWheel_response", handleSpinWheelResponse);
    useWebSocketStore
      .getState()
      .registerHandler("ticketHistory_response", handleTicketGet);
    useWebSocketStore
      .getState()
      .registerHandler("leaderboard_response", handleLeaderboardGet);
    useWebSocketStore
      .getState()
      .registerHandler("userProfile_response", handleUserProfileGet);
    useWebSocketStore
      .getState()
      .registerHandler("megaPot_response", handleMegaPotGet);
    useWebSocketStore
      .getState()
      .registerHandler("latestDraw_response", handleLatestDrawGet);
    useWebSocketStore
      .getState()
      .registerHandler("createTicket_response", handleCreateTicketResponse);
    useWebSocketStore
      .getState()
      .registerHandler(
        "doubleTroubleDrawResult_response",
        handleDoubleTroubleDrawResult
      );
    useWebSocketStore
      .getState()
      .registerHandler(
        "createDoubleTroubleTicket_response",
        handleCreateDoubleTroubleTicketResponse
      );
    useWebSocketStore
      .getState()
      .registerHandler("updatedUser_response", (payload) => {
        const updatedUserPayload = payload as UpdatedUserResponsePayload;
        if (updatedUserPayload.success) {
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
    useWebSocketStore
      .getState()
      .registerHandler("cashOutAviatorTicket_response", (payload) => {
        const cashOutPayload = payload as CashOutAviatorTicketResponsePayload;
        if (cashOutPayload.success) {
          useWebSocketStore.getState().updateUserData(cashOutPayload.data.user);
          toast({
            variant: "success",
            title: "Cash Out Successful",
            description: `You have cashed out ${cashOutPayload.data.aviatorBidSave.amountWon} coins with a multiplier of ${cashOutPayload.data.aviatorBidSave.cashOutMultiplier}.`,
          });
          useWebSocketStore.getState().setUserHistoryAviatorBets((prev) =>
            prev.map((bet) =>
              bet.outcome === "pending"
                ? {
                    ...bet,
                    outcome: "win",
                    cashOutMultiplier:
                      cashOutPayload.data.aviatorBidSave.cashOutMultiplier,
                    amountWon: cashOutPayload.data.aviatorBidSave.amountWon,
                  }
                : bet
            )
          );
        } else {
          useWebSocketStore
            .getState()
            .setErrorMessage(
              cashOutPayload.message || "Error cashing out aviator ticket"
            );
        }
      });
    return () => {
      // Optionally unregister on cleanup if needed, but for global store, often not necessary
    };
  }, []);
};
