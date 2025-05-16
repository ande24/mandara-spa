"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { getFirestore, doc, getDoc, collection, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Image = dynamic(() => import("next/image"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });
const ChartItem = dynamic(() => import("@/components/chartItem"), { ssr: false });
const Timeline = dynamic(() => import("@/components/timeline"), { ssr: false });

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);

export default function Page() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const [branches, setBranches] = useState([]);
  const [branchData, setBranchData] = useState(null);

  const [items, setItems] = useState([]);
  const [itemsLow, setItemsLow] = useState([]);
  const [itemsOut, setItemsOut] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [services, setServices] = useState([]);

  const [isBusinessAdmin, setIsBusinessAdmin] = useState(false);

  const [dailyCustomers, setDailyCustomers] = useState(0);
  const [prevDailyCustomers, setPrevDailyCustomers] = useState(0);
  const [dailyCustomersDiff, setDailyCustomersDiff] = useState(0);

  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [prevMonthlyIncome, setPrevMonthlyIncome] = useState(0);
  const [monthlyIncomeDiff, setMonthlyIncomeDiff] = useState(0);

  const [monthlyBookings, setMonthlyBookings] = useState(0);
  const [prevMonthlyBookings, setPrevMonthlyBookings] = useState(0);
  const [monthlyBookingsDiff, setMonthlyBookingsDiff] = useState(0);

  const [incomeRange, setIncomeRange] = useState([]);
  const [bookingsToday, setBookingsToday] = useState([]);

  const [currMVP, setCurrMVP] = useState(null);
  const [prevMVP, setPrevMVP] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [selectedMonth, setSelectedMonth] = useState("");



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



  const getPrevMonth = (currMonth) => {
    let [year, month] =currMonth.split("-").map(Number); 
      month -= 1; 
    
      if (month === 0) { 
        month = 12;
        year -= 1;
      }

    return `${year}-${String(month).padStart(2, "0")}`
  }



  const getPrevDate = (date) => {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, "0"); 
    const dd = String(yesterday.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }



  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
              console.log("USER: ", currentUser)
              console.log("USER EMAIL: ", currentUser.email)
              console.log("USER EMAIL VERIFIED: ", currentUser.emailVerified)
              setUser(currentUser);
          } 
          else {
            console.log("NO USER")
            router.push("/tmsAdmin/login");
          }
      });

      return () => unsubscribe();
  }, [router]);



  useEffect(() => {
      if (user) {
          const fetchUserData = async () => {
              try {
                  const docRef = doc(db, "users", user.uid);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                      setUserData(docSnap.data());
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
          console.log(userData);
          console.log(userData.user_role);
          if (userData.user_role === "business_admin") {
              console.log("business admin");
              setIsBusinessAdmin(true);
              return;
          }
          else if (userData.user_role === "branch_admin") {
              return;
          }
          else {
            console.log("not admin");
            router.push("/");
            return;
          }
      }
  }, [userData, router])


  useEffect(() => {
      if (user && userData && userData.branch_id) {
          const fetchBranchData = async () => {
              try {
                  // console.log(userData)
                  const branchRef = doc(db, "branches", userData.branch_id); 
                  const branchSnap = await getDoc(branchRef);
                  if (branchSnap.exists()) {
                      setBranchData(branchSnap.data());
                      // console.log("branchData: ", branchSnap.data())
                  } else {
                      console.log("No branch data found");
                  }
              } catch (error) {
                  console.error("Error fetching branch data:", error);
              } 
          };

          fetchBranchData();
      }
  }, [userData, user]);



  useEffect(() => {
      if (!userData || !userData?.branch_id || !branchData) {
        return;
      }
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

                  setServices(serviceList);
              } catch (error) {
                  console.error("Error fetching services:", error);
              }
          };
          fetchServices();
      
  }, [userData, branchData]);



  useEffect(() => {
    if (items.length > 0) {
      setItemsLow(items.filter(item => Number(item.quantity) < 10 && Number(item.quantity) > 0));
      setItemsOut(items.filter(item => Number(item.quantity) === 0));
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
    if (!userData || !userData.branch_id || !branchData) {
      console.log("userData or branchData is not ready yet");
      return;
    }

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

                      const fullDateTime = new Date(`${data.booked_date} ${data.booked_time}`);

                      return {
                          id: docu.id,
                          date: data.booked_date,
                          time: data.booked_time,
                          fullDateTime: fullDateTime,
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
          bookingList.sort((a, b) => a.fullDateTime - b.fullDateTime );

          setBookings(bookingList);
      });

      return () => unsubscribe();
  }, [userData, branchData, services]);

  useEffect(() => {
    if (!userData?.branch_id || !selectedDate) return;

    const branchRef = doc(db, "branches", userData.branch_id);
    const dateObj = new Date(selectedDate);
    const formattedDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}-${dateObj.getFullYear()}`;
    const scheduleRef = doc(branchRef, "schedule", formattedDate);

    const unsubscribe = onSnapshot(scheduleRef, (docSnap) => {
      if (docSnap.exists()) {
        console.log("Schedule data:", docSnap.data());
        setSchedule(docSnap.data().slots || []);
      } else {
        setSchedule([]);
      }
    });

    console.log("schedule: ", formattedDate, schedule)

    return () => unsubscribe();
  }, [userData, selectedDate]);
  
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

                    // console.log("Booking: ", bookingData)
                    // console.log("transaction: ", data)

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

        // console.log("transactions: ", transactionList);
        setTransactions(transactionList);
    });

    return () => unsubscribe();
}, [userData, branchData, services]);

useEffect(() => {
  const fetchBranches = async () => {
      const branchCollection = collection(db, "branches");
      const branchSnapshot = await getDocs(branchCollection);
      const branchList = branchSnapshot.docs
      .filter(doc => doc.id !== "schema")
      .map(doc => ({
          id: doc.id,
          name: doc.data().branch_location
      }));
      setBranches(branchList);
  };
  fetchBranches();
}, [userData]);

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
        .filter((transaction) => transaction.date.startsWith(getPrevMonth(selectedMonth)))
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
  }, [userData, branchData, selectedMonth, selectedDate, transactions])



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
          (booking) => booking.date.startsWith(getPrevMonth(selectedMonth))
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
  }, [userData, branchData, selectedMonth, bookings])



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
          (transaction) => transaction.date === getPrevDate(selectedDate))
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
  }, [userData, branchData, selectedDate, bookings, transactions])

  useEffect(() => {
    if (!branches || branches.length === 0) {
      return;
    }
    const getBestBranches = async() => {
      let highestPrev = 0
      let prevName = ""

      let highestCurr = 0
      let currName = ""

      for (const { id, name } of branches) {
        const branchRef = doc(db, "branches", id);
        const transRef = collection(branchRef, "transactions");
        const transSnapshot = await getDocs(transRef);
        const transList = transSnapshot.docs
        .filter(doc => doc.id !== "schema" && doc.id !== "placeholder")
        .map(doc => ({
          id: doc.id,
          date: doc.data().transaction_date,
          income: doc.data().service_income
        }));

        const salesThisMonth = transList
        .filter((transaction) => transaction.date.startsWith(selectedMonth))
        .reduce((sum, transaction) => sum + transaction.income, 0);

        if (salesThisMonth > highestCurr) {
          highestCurr = salesThisMonth;
          currName = name;
        }

        const salesLastMonth = transList
        .filter((transaction) => transaction.date.startsWith(getPrevMonth(selectedMonth)))
        .reduce((sum, transaction) => sum + transaction.income, 0);

        if (salesLastMonth > highestPrev) {
          highestPrev = salesLastMonth;
          prevName = name;
        }
      }

      setCurrMVP({
        name: currName, 
        amount: highestCurr
      });

      setPrevMVP({
        name: prevName, 
        amount: highestPrev
      })
    };

    getBestBranches();
  }, [branches, selectedDate, selectedMonth]);

  

  const changeDate = (prevDate, date) => {
    const [year, month, day] = date.split("-").map(Number);
    const [pyear, pmonth, pday] = prevDate.split("-").map(Number);

    if (!date) {
      if (pday === 1) {
        if (pmonth === 2) {
          const isLeapYear = (pyear % 4 === 0 && pyear % 100 !== 0) || (pyear % 400 === 0);
          const nday = isLeapYear ? 29 : 28;
          date = `${pyear}-${String(pmonth)}-${nday}`;
        } else if ([4, 6, 9, 11].includes(pmonth)) {
          const nday = 30;
          date = `${pyear}-${String(pmonth)}-${nday}`;
        } else {
          const nday = 31;
          date = `${pyear}-${String(pmonth)}-${nday}`;
        }
      }
      else {
        const nday = 1;
        date = `${pyear}-${String(pmonth)}-${nday}`;
      }
    }

    const newDate = new Date(date); 
    
    if (!newDate) {
      window.alert("You tried to input an invalid date!", "Try adjusting the day value before changing the month or year.")
      return;
    }
    
    newDate.setHours(8, 0, 0, 0); 
  
    // If valid, update the selected date and month
    const formattedDate = newDate.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    setSelectedMonth(formattedDate.slice(0, 7));
  };

  useEffect(() => {
    const getIncomeRange = () => {
      const income = {};  
      const today = new Date(selectedDate + "T00:00:00");
    
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = date.toLocaleDateString("en-CA"); 
        income[key] = 0;
      }

      console.log(transactions)
    
      transactions.forEach(({ date, sales }) => {
        const formattedDate = new Date(date).toLocaleDateString("en-CA");
        if (income[formattedDate] !== undefined) {
          income[formattedDate] += sales;
        }
      });
    
      setIncomeRange(Object.values(income).reverse()); 
    };

    getIncomeRange();
  }, [transactions, selectedDate])
  
  

  useEffect(() => {
    const getTodayBookings = () => {
      const formattedDate = new Date(selectedDate).toLocaleDateString("en-CA");
      let bookingsToday = []
      bookingsToday = bookings
        .filter(({ date }) => new Date(date).toLocaleDateString("en-CA") === formattedDate)
        .map((booking) => ({ 
          id: booking.id,
          time: booking.time,
          status: booking.status
        })); 

      setBookingsToday(bookingsToday);
    }

    getTodayBookings();
  }, [bookings, selectedDate])

  return (
    <>
      {userData && branchData && items && selectedDate && selectedMonth && currMVP && prevMVP && incomeRange && (
        <div className="flex flex-col min-h-screen bg-[#301414] p-15">
          <Sidebar admin={isBusinessAdmin}/>

          <div className="flex justify-center p-6 ">
            <Image priority className="" src={"/images/mandara_gold.png"} width={200} height={200} alt={"The Mandara Spa Logo"} />
          </div>

          <div className="flex-1 p-6 pt-6 ">

            <div className="flex justify-between w-full p-5 px-10 items-center mb-6 bg-yellow-50 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
              <h1 className="text-4xl font-bold">{userData.branch_location}</h1>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => changeDate(selectedDate, e.target.value)} 
                className="border p-2 rounded scale-90 hover:scale-102 transition-all mb"
              />
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div onClick={() => {router.push('transactions')}} className="bg-yellow-50 cursor-pointer p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold">Monthly Income:</h3>
                <p className="text-2xl font-bold">{`₱${monthlyIncome} `}<span className={`${monthlyIncome > prevMonthlyIncome ? "text-green-500" : monthlyIncome === prevMonthlyIncome ? "text-gray-600" : "text-red-500"} text-sm`}>{monthlyIncomeDiff}</span></p>
              </div>
              <div onClick={() => {router.push('bookings')}} className="bg-yellow-50 p-4 cursor-pointer shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold">Monthly Bookings:</h3>
                <p className="text-2xl font-bold">{monthlyBookings} <span className={`${monthlyBookings > prevMonthlyBookings ? "text-green-500" : monthlyBookings === prevMonthlyBookings ? "text-gray-600" : "text-red-500"} text-sm`}>{monthlyBookingsDiff}</span></p>
              </div>
              <div onClick={() => {router.push('transactions')}} className="bg-yellow-50 cursor-pointer p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold">Customers Served Today:</h3>
                <p className="text-2xl font-bold">{dailyCustomers} <span className={`${dailyCustomers > prevDailyCustomers ? "text-green-500" : dailyCustomers === prevDailyCustomers ? "text-gray-600" : "text-red-500"} text-sm`}>{dailyCustomersDiff}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-6 mb-6">
              <div onClick={() => {router.push('transactions')}} className="bg-yellow-50 cursor-pointer p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all col-span-2">
              <h2 className="text-lg font-bold mb-2">Daily Income:</h2>
                <ChartItem chartData={incomeRange} endDate={selectedDate}/>
              </div>
              <div onClick={() => {router.push('bookings')}} className="bg-yellow-50 cursor-pointer p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all col-span-5">
                <h2 className="text-lg font-bold mb-2">Schedule Today:</h2>
                {schedule && <Timeline schedule={schedule} bookings={bookingsToday}/>}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-6">
              <div onClick={() => {router.push('inventory')}} className="bg-yellow-50 p-4 col-span-2 cursor-pointer shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all">
                <h2 className="text-lg font-bold mb-2">Inventory Alerts</h2>
                {itemsOut.length === 0 && itemsLow.length === 0 ? (
                  <p className="text-green-600">All good!</p>
                ) : (
                  <ul className="text-sm">
                  {itemsOut.map(item => (
                    <li key="item.id" className="text-red-500">⚠ {item.name} - Out of Stock</li>
                  ))}
                  {itemsLow.map(item => (
                    <li key="item.id" className="text-yellow-500">⚠ {item.name} ({item.quantity}) - Running Low</li>
                  ))}
                </ul>
                )}
              </div>

              <div className="bg-yellow-50 col-span-3 p-4 shadow-md hover:scale-102 rounded-lg hover:shadow-lg transition-all flex flex-col">
                <h2 className="text-lg font-bold mb-2">Best Performing Branches</h2>
                <div className="flex gap-10">
                  <div className="w-1/2">
                    <p className={`text-xl font-semibold ${currMVP.name === "" ? "hidden" : ""}`}>{currMVP.name}</p>
                    <p className={`text-sm text-gray-500 ${currMVP.name === "" ? "hidden" : ""}`}>Made ₱{currMVP.amount} this month</p>
                  </div>
                  <div className="w-1/2">
                    <p className={`text-xl font-semibold ${prevMVP.name === "" ? "hidden" : ""}`}>{prevMVP.name}</p>
                    <p className={`text-sm text-gray-500 ${prevMVP.name === "" ? "hidden" : ""}`}>Made ₱{prevMVP.amount} last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
