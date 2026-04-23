import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { offersAPI } from "../api/offersAPI";
import { applicationsAPI } from "../api/applicationsAPI";
import { usersAPI } from "../api/usersAPI";
import { AuthContext } from "./AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";


export const DataContext = createContext();

export function DataProvider({ children }) {
  const auth = useContext(AuthContext);
const user = auth?.user;
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);

  const loadInitialData = useCallback(async () => {
    const role = user?.role;
    const calls = [loadOffers()];
    if (role === "admin")                                    calls.push(loadUsers());
    if (role === "étudiant" || role === "entreprise")        calls.push(loadApplications());
    await Promise.all(calls);
  }, [user]);

  useEffect(() => {
  if (!user) return;
  loadInitialData();
}, [user]);

  const loadOffers = async () => {
    setLoadingOffers(true);
    try {
      const res = await offersAPI.getAll();
      setOffers(res.success ? res.offers : []);
    } catch {
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res?.users || []);
    } catch {
      setUsers([]);
    }
  };

  const addOffer = async (offer) => {
    try {
      const res = await offersAPI.create(offer);
      if (res.success) {
        setOffers((prev) => [...prev, res.offer]);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateOffer = async (id, data) => {
    try {
      const res = await offersAPI.update(id, data);
      if (res.success) {
        setOffers((prev) => prev.map((o) => (o._id === id ? res.offer : o)));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteOffer = async (id) => {
    try {
      const res = await offersAPI.delete(id);
      if (res.success) setOffers((prev) => prev.filter((o) => o._id !== id));
      return res;
    } catch {
      return { success: false };
    }
  };

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await applicationsAPI.getMy();
      setApplications(res.success ? res.applications : []);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const addApplication = async (offerId, motivation, cv) => {
    try {
      const res = await applicationsAPI.apply(offerId, motivation, cv);
      if (res.success) {
        setApplications((prev) => [...prev, res.application]);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const res = await applicationsAPI.updateStatus(id, status);
      if (res.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
      }
      return res;
    } catch {
      return { success: false };
    }
  };

  const deleteApplication = async (id) => {
    try {
      const res = await applicationsAPI.delete(id);
      if (res.success) setApplications((prev) => prev.filter((a) => a._id !== id));
      return res;
    } catch {
      return { success: false };
    }
  };

  const getStats = () => ({
    totalOffers: offers.length,
    totalApplications: applications.length,
    accepted: applications.filter((a) => a.status === "Acceptée").length,
    pending: applications.filter((a) => a.status === "En attente").length,
    inProgress: applications.filter((a) => a.status === "En cours").length,
    refused: applications.filter((a) => a.status === "Refusée").length,
  });

 return (
    <DataContext.Provider
      value={{
        // 1. Dima n-thabbtou elli offers w applications dima arrays
        offers: offers || [],
        applications: applications || [],
        users: users || [],
        loadingOffers,
        loadingApps,
        loadOffers,
        loadApplications,
        loadUsers,
        addOffer,
        updateOffer,
        deleteOffer,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        getStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    // 2. Safety check ken l-context mahouch wrapped mrigel
    return { offers: [], applications: [] }; 
  }
  return context;
};