"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ChartItem from "@/components/chartItem";
import Timeline from "@/components/timeline";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { getFirestore, doc, getDoc, collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function Page() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [branchData, setBranchData] = useState(null);

  const [items, setItems] = useState([]);
  const [itemsLow, setItemsLow] = useState([]);
  const [itemsOut, setItemsOut] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [services, setServices] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isBusinessAdmin, setIsBusinessAdmin] = useState(false);

  const [dailyCustomers, setDailyCustomers] = useState(0);
  const [prevDailyCustomers, setPrevDailyCustomers] = useState(0);
  const [dailyCustomersDiff, setDailyCustomersDiff] = useState(0);

  const [incomeRange, setIncomeRange] = useState([]);

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [prevMonthlyIncome, setPrevMonthlyIncome] = useState(0);
  const [monthlyIncomeDiff, setMonthlyIncomeDiff] = useState(0);

  const [monthlyBookings, setMonthlyBookings] = useState(0);
  const [prevMonthlyBookings, setPrevMonthlyBookings] = useState(0);
  const [monthlyBookingsDiff, setMonthlyBookingsDiff] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [prevDate, setPrevDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [prevMonth, setPrevMonth] = useState("");

  useEffect(() => {
    const getDateAndMonth = () => {
      const now = new Date();

      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0"); 
      const dd = String(now.getDate()).padStart(2, "0");

      setSelectedDate(`${yyyy}-${mm}-${dd}`);  
      setSelectedMonth(`${yyyy}-${mm}`);
    };

    getDateAndMonth();
  }, []);

  useEffect(() => {
    const getPrevMonth = (selectedMonth) => {
      let [year, month] = selectedMonth.split("-").map(Number); 
      month -= 1; 
    
      if (month === 0) { 
        month = 12;
        year -= 1;
      }
    
      return `${year}-${String(month).padStart(2, "0")}`; 
    };

    setPrevMonth(getPrevMonth(selectedMonth))
  }, [selectedDate, selectedMonth]);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
              setUser(currentUser);
          } 
          else {
            router.push("/tmsAdmin/login");
          }
      });

      return () => unsubscribe();
  }, []);

  useEffect(() => {
      if (user) {
          const fetchUserData = async () => {
              try {
                  const docRef = doc(db, "users", user.uid);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                      setUserData(docSnap.data());
                      console.log("userData: ", docSnap.data());
                  } else {
                      console.log("No user data found in Firestore");
                  }
              } catch (error) {
                  console.error("Error fetching user data:", error);
              }
          };

          fetchUserData();
      }
  }, [user]);

  useEffect(() => {
      if (userData) {
          if (userData.user_role === "business_admin") {
              setIsAdmin(true);
              setIsBusinessAdmin(true);
          }
          else if (userData.user_role === "branch_admin") {
              setIsAdmin(true);
              setIsBusinessAdmin(false);
          }
          else {
              return router.push("/");
          }
      }
  }, [userData])

  useEffect(() => {
      if (user) {
          const fetchBranchData = async () => {
              try {
                  console.log(userData)
                  const branchRef = doc(db, "branches", userData.branch_id); 
                  const branchSnap = await getDoc(branchRef);
                  if (branchSnap.exists()) {
                      setBranchData(branchSnap.data());
                      console.log("branchData: ", branchSnap.data())
                  } else {
                      console.log("No branch data found");
                  }
              } catch (error) {
                  console.error("Error fetching branch data:", error);
              } 
          };

          fetchBranchData();
      }
  }, [userData]);

  useEffect(() => {
      if (userData?.branch_id && branchData) {
          const fetchServices = async () => {
              try {
                  const branchRef = doc(db, "branches", userData.branch_id);
                  const serviceCollection = query(collection(branchRef, "services"), orderBy("service_name"));
                  const serviceSnapshot = await getDocs(serviceCollection);
                  const serviceList = serviceSnapshot.docs
                      .filter(doc => doc.id !== "placeholder")
                      .map(doc => ({
                          id: doc.id,
                          name: doc.data().service_name,
                          price: doc.data().service_price,
                          desc: doc.data().service_desc,
                          duration: doc.data().service_duration,
                          category: doc.data().service_category,
                          status: doc.data().service_status
                      }));
  
                  console.log("services: ", serviceList);
                  setServices(serviceList);
              } catch (error) {
                  console.error("Error fetching services:", error);
              }
          };
          fetchServices();
      }
  }, [branchData]);

  useEffect(() => {
    if (items.length > 0) {
      setItemsLow(items.filter(item => item.quantity < 10 && item.quantity > 0));
      setItemsOut(items.filter(item => item.quantity === 0));
    }
  }, [items]);

  useEffect(() => {
      if (userData?.branch_id && branchData) {
          const branchRef = doc(db, "branches", userData.branch_id);
          const itemCollection = collection(branchRef, "inventory");
  
          const unsubscribe = onSnapshot(itemCollection, (snapshot) => {
              const itemList = snapshot.docs
                  .filter(doc => doc.id !== "placeholder")
                  .map(doc => ({
                      id: doc.id,
                      name: doc.data().item_name,
                      price: doc.data().item_price,
                      quantity: doc.data().item_quantity
                  }));
              
  
              console.log("items: ", itemList);
              setItems(itemList);
          }, (error) => {
              console.error("Error fetching items:", error);
          });
  
          return () => unsubscribe();
      }
  }, [branchData, userData?.branch_id]);

  useEffect(() => {
      if (!userData?.branch_id || !branchData) return;

      const branchRef = doc(db, "branches", userData.branch_id);
      const bookingCollection = collection(branchRef, "bookings");

      const unsubscribe = onSnapshot(bookingCollection, async (snapshot) => {
          const bookingList = await Promise.all(
              snapshot.docs
                  .filter(docu => docu.id !== "placeholder")
                  .map(async (docu) => {
                      const data = docu.data();
                      
                      let customerName = "", customerEmail = "";
                      if (data.customer_id) {
                          const customerSnap = await getDoc(doc(db, "users", data.customer_id));
                          if (customerSnap.exists()) {
                              customerName = customerSnap.data().user_name; 
                              customerEmail = customerSnap.data().user_email;
                          }
                      }

                      let serviceName = "", servicePrice = "";
                      if (data.service_id) {
                          const serviceRef = doc(branchRef, "services", data.service_id);
                          const serviceSnap = await getDoc(serviceRef);
                          if (serviceSnap.exists()) {
                              serviceName = serviceSnap.data().service_name;
                              servicePrice = serviceSnap.data().service_price;
                          }
                      }

                      let total = data.no_of_customers * Number(servicePrice)

                      return {
                          id: docu.id,
                          date: data.booked_date,
                          time: data.booked_time,
                          status: data.booking_status,
                          customer: customerName,
                          total: total,
                          price: servicePrice,
                          email: customerEmail,
                          pax: data.no_of_customers,
                          service: serviceName,
                      };
                  })
          );

          console.log("bookings: ", bookingList);
          setBookings(bookingList);
      });

      return () => unsubscribe();
  }, [userData?.branch_id, !!branchData, !!services]);

  useEffect(() => {
    if (!userData?.branch_id || !branchData) return;

    const branchRef = doc(db, "branches", userData.branch_id);
    const transactionCollection = collection(branchRef, "transactions");

    const unsubscribe = onSnapshot(transactionCollection, async (snapshot) => {
        const transactionList = await Promise.all(
            snapshot.docs
                .filter(docu => docu.id !== "placeholder")
                .map(async (docu) => {
                    let bookingData = null;
                    const data = docu.data();

                    const bookingRef = doc(branchRef, "bookings", data.bookingId);
                    const bookingSnap = await getDoc(bookingRef);
                    
                    let serviceName = "", servicePrice = "";
                    if (bookingSnap.exists()) {  
                        bookingData = bookingSnap.data();
                        if (bookingData.service_id) {  
                            const serviceRef = doc(branchRef, "services", bookingData.service_id);
                            const serviceSnap = await getDoc(serviceRef);
                            if (serviceSnap.exists()) {
                                serviceName = serviceSnap.data().service_name;
                                servicePrice = serviceSnap.data().service_price;
                            }
                        }
                    }

                    console.log("Booking: ", bookingData)
                    console.log("transaction: ", data)

                    return {
                        id: docu.id,
                        date: bookingData ? bookingData.booked_date : "",
                        time: bookingData ? bookingData.booked_time : "Booking not found",
                        booking: data.bookingId,
                        pax: data.no_of_customers,
                        serviceName: serviceName,
                        servicePrice: servicePrice,
                        sales: data.service_income,
                        items: data.items_used
                            ? data.items_used.map(item => ({
                                id: item.id,
                                name: item.name,
                                price: item.price,  
                                quantity: item.quantity 
                            }))
                            : []  
                    };
                })
        );

        console.log("transactions: ", transactionList);
        setTransactions(transactionList);
    });

    return () => unsubscribe();
}, [userData?.branch_id, !!branchData, !!services]);

  // useEffect(() => {
  //   if (transactions) {
  //     const getIncomeRange = (transactions) => {
  //       const today = new Date(selectedDate);
  //       today.setHours(0, 0, 0, 0); 
      
  //       let dailyIncome = [];
  //       for (let i = 0; i < 7; i++) {
  //         let date = new Date(today);
  //         date.setDate(today.getDate() - i);
  //         let dateString = date.toISOString().split("T")[0];
  //         dailyIncome[i] = 0;
      
  //         for (let transaction of transactions) {
  //           const bookingDate = new Date(transaction.date);
  //           bookingDate.setHours(0, 0, 0, 0);
  //           let transactionDateString = bookingDate.toISOString().split("T")[0];
      
  //           if (transactionDateString === dateString) {
  //             dailyIncome[i] += transaction.sales;
  //           }
  //         }
  //       }
        
  //       console.log("prev income: ", dailyIncome);
  //       setIncomeRange(dailyIncome);
  //     };

  //     getIncomeRange(transactions);
  //   }
  // }, [transactions])

  useEffect(() => {
    if (!userData || !branchData || !transactions) {
      return;
    }
    const fetchMonthlyIncome = async () => {
      try {
        const salesThisMonth = transactions
        .filter((transaction) => transaction.date.startsWith(selectedMonth))
        .reduce((sum, transaction) => sum + transaction.sales, 0);

        setMonthlyIncome(salesThisMonth);

        const salesLastMonth = transactions
        .filter((transaction) => transaction.date.startsWith(prevMonth))
        .reduce((sum, transaction) => sum + transaction.sales, 0);

        setPrevMonthlyIncome(salesLastMonth);

        if (salesLastMonth === salesThisMonth) {
          return setMonthlyIncomeDiff("=0%");
        }
        else if (salesLastMonth === 0) {
          return setMonthlyIncomeDiff("↑100%");
        } 
        else if (salesThisMonth === 0) {
          return setMonthlyIncomeDiff("↓100%");
        }

        if (salesThisMonth > salesLastMonth) {
          return setMonthlyIncomeDiff(`↑${(((salesThisMonth - salesLastMonth) / salesLastMonth) * 100).toFixed(2)}%`)
        }
        else {
          return setMonthlyIncomeDiff(`↓${(((salesThisMonth - salesLastMonth) / salesLastMonth) * -100).toFixed(2)}%`)
        }
      } catch (error) {
        console.error("Error fetching monthly income: ", error);  
      }
    };

    fetchMonthlyIncome();
  }, [userData, branchData, selectedMonth, prevMonth, selectedDate, JSON.stringify(transactions)])

  useEffect(() => {
    if (!userData || !branchData || !bookings) {
      return;
    }
    const fetchMonthlyBookings = async () => {
      try {
        const bookingsThisMonth = bookings.filter(
          (booking) => booking.date.startsWith(selectedMonth)
        ).length;

        setMonthlyBookings(bookingsThisMonth);

        const bookingsLastMonth = bookings.filter(
          (booking) => booking.date.startsWith(prevMonth)
        ).length;

        setPrevMonthlyBookings(bookingsLastMonth);

        if (bookingsLastMonth === bookingsThisMonth) {
          return setMonthlyBookingsDiff("")
        }

        if (bookingsThisMonth > bookingsLastMonth) {
          return setMonthlyBookingsDiff(`+${bookingsThisMonth - bookingsLastMonth}`);
        }
        else {
          return setMonthlyBookingsDiff(`-${bookingsLastMonth - bookingsThisMonth}`);
        }


      } catch (error) {
        console.error("Error fetching monthly bookings: ", error);  
      }
    };

    fetchMonthlyBookings();
  }, [userData, branchData, selectedMonth, prevMonth, JSON.stringify(bookings)])

  useEffect(() => {
    if (!userData || !branchData || !bookings) {
      return;
    }
    const fetchDailyCustomers = async () => {
      try {
        const customersToday = transactions
        .filter(
          (transaction) => transaction.date === selectedDate)
        .reduce((sum, transaction) => sum + Number(transaction.pax), 0);

        setDailyCustomers(customersToday);

        const customersYesterday = transactions
        .filter(
          (transaction) => transaction.date === prevDate)
        .reduce((sum, transaction) => sum + Number(transaction.pax), 0);

        setPrevDailyCustomers(customersYesterday);

        if (customersToday === customersYesterday) {
          return setDailyCustomersDiff("")
        }

        if (customersToday > customersYesterday) {
          return setDailyCustomersDiff(`+${customersToday - customersYesterday}`);
        }
        else {
          return setDailyCustomersDiff(`-${customersYesterday - customersToday}`);
        }

      } catch (error) {
        console.error("Error fetching daily bookings: ", error);  
      }
    };

    fetchDailyCustomers();
  }, [userData, branchData, selectedDate, prevDate, JSON.stringify(transactions)])

  const changeDate = (date) => {
    setSelectedDate(date);
    setSelectedMonth(date.slice(0, 7));

    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);

    const prevYYYY = yesterday.getFullYear();
    const prevMM = String(yesterday.getMonth() + 1).padStart(2, "0"); 
    const prevDD = String(yesterday.getDate()).padStart(2, "0");

    setPrevDate(`${prevYYYY}-${prevMM}-${prevDD}`)

    let prevYear = date.getFullYear();
    let prevMonth = date.getMonth();

    if (prevMonth === 0) {  
      prevMonth = 12;
      prevYear -= 1;
    } else {
      prevMonth = String(prevMonth).padStart(2, "0"); 
    }

    setPrevMonth(`${prevYear}-${prevMonth}`);
  }

  return (
    <>
      {userData && branchData && items && (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />

          <div className="flex-1 p-6 pt-6">

            <div className="flex justify-between items-center mb-3">
              <h1 className="text-2xl pl-20 font-bold">{userData.branch_location}</h1>
              {isBusinessAdmin && (<button className="bg-blue-500 text-white px-4 py-2 rounded">Buttons</button>)}
            </div>

            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => changeDate(e.target.value)} 
              className="border p-2 rounded scale-90 hover:scale-102 transition-all mb-5"
            />

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold">Monthly Income:</h3>
                <p className="text-2xl font-bold">{`₱ ${monthlyIncome} `}<span className={`${monthlyIncome > prevMonthlyIncome ? "text-green-500" : monthlyIncome === prevMonthlyIncome ? "text-gray-600" : "text-red-500"} text-sm`}>{monthlyIncomeDiff}</span></p>
              </div>
              <div className="bg-white p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold">Monthly Bookings:</h3>
                <p className="text-2xl font-bold">{monthlyBookings} <span className={`${monthlyBookings > prevMonthlyBookings ? "text-green-500" : monthlyBookings === prevMonthlyBookings ? "text-gray-600" : "text-red-500"} text-sm`}>{monthlyBookingsDiff}</span></p>
              </div>
              <div className="bg-white p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold">Customers Served Today:</h3>
                <p className="text-2xl font-bold">{dailyCustomers} <span className={`${dailyCustomers > prevDailyCustomers ? "text-green-500" : dailyCustomers === prevDailyCustomers ? "text-gray-600" : "text-red-500"} text-sm`}>{dailyCustomersDiff}</span></p>
                <p>{prevDailyCustomers}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 shadow-md rounded-lg">
                <ChartItem data={incomeRange}/>
              </div>
              <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-lg font-bold mb-2">Upcoming Appointments</h2>
                <Timeline />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-lg font-bold mb-2">Inventory Alerts</h2>
                <ul className="text-sm">
                  {itemsOut.map(item => (
                    <li key="item.id" className="text-red-500">⚠ {item.name} - Out of Stock</li>
                  ))}
                  {itemsLow.map(item => (
                    <li key="item.id" className="text-yellow-500">⚠ {item.name} ({item.quantity}) - Running Low</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-lg font-bold mb-2">Best Performing Service</h2>
                <p className="text-xl font-semibold">💆 The Mandara Signature Massage</p>
                <p className="text-sm text-gray-500">Booked 120 times this month</p>
              </div>

              <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-lg font-bold mb-2">Best Performing Service</h2>
                <p className="text-xl font-semibold">💆 The Mandara Signature Massage</p>
                <p className="text-sm text-gray-500">Booked 120 times this month</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
