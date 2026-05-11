import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { reservationService } from "../../services/reservation";
import { hotelService, Hotel } from "../../services/hotel";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const { height } = Dimensions.get("window");

const TIME_OPTIONS = [
  "09:00 AM - 12:30 PM",
  "01:00 PM - 03:30 PM",
  "04:00 PM - 06:00 PM",
  "07:00 PM - 09:00 PM",
];
const GUEST_OPTIONS = ["1", "2", "3", "4", "5", "6", "7+"];
const SEATING_OPTIONS = ["Indoor", "Outdoor", "Window", "Rooftop"];
const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Date",
  "Special Occasion",
  "Business Meal",
  "Casual Dining",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

export default function BookingReservationScreen() {
  const router = useRouter();
  const { id, reservationId, mode } = useLocalSearchParams();
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const { showToast } = useToast();
  const hotelId = Number(id);

  const now = new Date();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [selectedDay, setSelectedDay] = useState(now.getDate());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [seating, setSeating] = useState("");
  const [occasion, setOccasion] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Contact Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [activeModal, setActiveModal] = useState<
    null | "date" | "time" | "guests" | "seating" | "contact" | "specialRequest"
  >(null);

  useEffect(() => {
    const initialize = async () => {
      setLoadingDetails(true);
      await fetchHotelDetails();

      if (isEdit && reservationId) {
        await fetchReservationForEdit(Number(reservationId));
      } else if (user) {
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setPhone(user.phoneNumber || "");
      }
      setLoadingDetails(false);
    };

    initialize();
  }, [user, hotelId, reservationId, mode]);

  const fetchHotelDetails = async () => {
    try {
      const data = await hotelService.getDetails(hotelId);
      setHotel(data);
    } catch (error: any) {
      console.error("Error fetching hotel details:", error);
    }
  };

  const fetchReservationForEdit = async (resId: number) => {
    try {
      const data = await reservationService.getById(resId);
      if (data) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        setPhone(data.phone);

        const resDate = new Date(data.date);
        setSelectedDay(resDate.getDate());
        setSelectedMonth(resDate.getMonth());
        setSelectedYear(resDate.getFullYear());

        setTime(data.time);
        setGuests(data.guestNumber.toString());
        setSeating(data.tableType);
        setOccasion(data.reservationType);
        setSpecialRequest(data.note || "");
        setAcceptedTerms(true);
      }
    } catch (error: any) {
      console.error("Error fetching reservation for edit:", error);
      showToast({
        message: "Failed to load reservation details",
        type: "error",
      });
    }
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear); // 0=Sun
  const paddingDays = (firstDay + 6) % 7;
  const calendarDays = [
    ...Array(paddingDays).fill(null),
    ...[...Array(daysInMonth).keys()].map((i) => i + 1),
  ];

  const formattedDate = `${String(selectedMonth + 1).padStart(2, "0")}/${String(selectedDay).padStart(2, "0")}/${selectedYear}`;

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else setSelectedMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else setSelectedMonth((m) => m + 1);
  };

  const handleSubmitReservation = async () => {
    if (!acceptedTerms) {
      showToast({
        message: "Please accept the terms and conditions",
        type: "error",
      });
      return;
    }
    if (!firstName || !lastName || !email || !phone) {
      showToast({
        message: "Please fill in your contact details",
        type: "error",
      });
      setActiveModal("contact");
      return;
    }
    if (!time || !guests || !seating) {
      showToast({
        message: "Please complete all selection fields",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const reservationData = {
        firstName,
        lastName,
        email,
        phone,
        date: formattedDate,
        time,
        tableType: seating,
        reservationType: occasion || "Casual Dining",
        guestNumber: parseInt(guests) || 2,
        specialRequest,
        customerId: user?.id,
      };

      if (isEdit && reservationId) {
        await reservationService.update(Number(reservationId), reservationData);
        showToast({
          message: "Reservation updated successfully!",
          type: "success",
        });
        router.replace("/(tabs)/bookings");
      } else {
        await reservationService.create(hotelId, reservationData);
        setActiveModal(null);
        router.replace("/booking/success");
      }
    } catch (error: any) {
      showToast({
        message: error?.message || "Action failed. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    if (activeModal === "date") return "Select Date";
    if (activeModal === "time") return "Select Time";
    if (activeModal === "guests") return "Number of Guests";
    if (activeModal === "seating") return "Seating Preference";
    if (activeModal === "contact") return "Your Details";
    if (activeModal === "specialRequest") return "Special Request";
    return "";
  };

  const getApplyLabel = () => {
    if (activeModal === "contact") return "Save Details";
    if (activeModal === "specialRequest")
      return submitting
        ? "Saving..."
        : isEdit
          ? "Update Reservation"
          : "Confirm Booking";
    return "Apply";
  };

  const handleApply = () => {
    if (activeModal === "specialRequest") {
      handleSubmitReservation();
    } else {
      setActiveModal(null);
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "date":
        return (
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <TouchableOpacity onPress={handlePrevMonth}>
                <Ionicons
                  name="chevron-back-outline"
                  size={22}
                  color="#1A202C"
                />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-[#3D2117]">
                {MONTHS[selectedMonth]} {selectedYear}
              </Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#1A202C"
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between mb-3">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <Text
                  key={d}
                  className="text-[#8E9BAE] text-xs flex-1 text-center font-medium"
                >
                  {d}
                </Text>
              ))}
            </View>
            <View className="flex-row flex-wrap">
              {calendarDays.map((day, i) => {
                const dayDate = day
                  ? new Date(selectedYear, selectedMonth, day)
                  : null;
                const isPast = !!(
                  dayDate &&
                  dayDate <
                    new Date(now.getFullYear(), now.getMonth(), now.getDate())
                );
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={day === null || isPast}
                    onPress={() => day && setSelectedDay(day)}
                    style={{ width: "14.28%" }}
                    className={`h-11 items-center justify-center rounded-full mb-1 ${day === selectedDay ? "bg-[#007AFF]" : ""}`}
                  >
                    {day && (
                      <Text
                        className={`text-sm ${day === selectedDay ? "text-white font-bold" : isPast ? "text-[#CBD5E0]" : "text-[#3D2117]"}`}
                      >
                        {day}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );

      case "time":
        return (
          <View>
            {TIME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setTime(opt)}
                className="flex-row justify-between items-center py-5 border-b border-[#F1F5F9]"
              >
                <Text className="text-base text-[#3D2117]">{opt}</Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${time === opt ? "border-[#007AFF]" : "border-[#CBD5E0]"}`}
                >
                  {time === opt && (
                    <View className="w-3 h-3 rounded-full bg-[#007AFF]" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "guests":
        return (
          <View className="flex-row flex-wrap">
            {GUEST_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setGuests(opt)}
                className={`w-16 h-16 items-center justify-center rounded-2xl mr-3 mb-3 border-2 ${guests === opt ? "bg-[#007AFF] border-[#007AFF]" : "border-[#F1F5F9] bg-white"}`}
              >
                <Text
                  className={`text-xl font-bold ${guests === opt ? "text-white" : "text-[#3D2117]"}`}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "seating":
        return (
          <View>
            {SEATING_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setSeating(opt)}
                className="flex-row justify-between items-center py-5 border-b border-[#F1F5F9]"
              >
                <Text className="text-base text-[#3D2117]">{opt}</Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${seating === opt ? "border-[#007AFF]" : "border-[#CBD5E0]"}`}
                >
                  {seating === opt && (
                    <View className="w-3 h-3 rounded-full bg-[#007AFF]" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "contact":
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3D2117] mb-2">
                First Name
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                className="border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-sm bg-[#F8FAFC]"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3D2117] mb-2">
                Last Name
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                className="border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-sm bg-[#F8FAFC]"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3D2117] mb-2">
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="jane@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-sm bg-[#F8FAFC]"
              />
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3D2117] mb-2">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+234..."
                keyboardType="phone-pad"
                className="border border-[#F1F5F9] p-4 rounded-2xl text-gray-800 text-sm bg-[#F8FAFC]"
              />
            </View>
          </KeyboardAvoidingView>
        );

      case "specialRequest":
        return (
          <View>
            <Text className="text-[#3D2117] font-bold mb-4">
              Any Special Request?
            </Text>
            <TextInput
              value={specialRequest}
              onChangeText={setSpecialRequest}
              placeholder="Dietary needs, special seating, etc."
              multiline
              className="border border-[#F1F5F9] p-4 rounded-2xl h-28 text-gray-800 text-sm mb-6 bg-[#F8FAFC]"
              textAlignVertical="top"
              placeholderTextColor="#A0AEC0"
            />

            <Text className="text-[#3D2117] font-bold mb-4">
              What's the Occasion?
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {OCCASIONS.map((occ) => (
                <TouchableOpacity
                  key={occ}
                  onPress={() => setOccasion(occ)}
                  className={`px-4 py-2 border rounded-full mr-2 mb-2 ${occasion === occ ? "bg-[#007AFF] border-[#007AFF]" : "bg-white border-[#F1F5F9]"}`}
                >
                  <Text
                    className={`text-xs ${occasion === occ ? "text-white" : "text-[#8E9BAE]"}`}
                  >
                    {occ}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              className="flex-row items-center mb-2"
            >
              <View
                className={`w-6 h-6 border-2 rounded-lg items-center justify-center ${acceptedTerms ? "bg-[#007AFF] border-[#007AFF]" : "border-[#CBD5E0]"}`}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text className="text-[#8E9BAE] text-xs ml-3 flex-1">
                By clicking, I accept the restaurant's{" "}
                <Text className="text-[#007AFF]">terms and conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  const contactComplete = firstName && lastName && email && phone;

  if (loadingDetails) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#FF8A00" />
        <Text className="text-[#8E9BAE] mt-4 font-medium">
          {isEdit ? "Loading reservation..." : "Loading restaurant..."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-6"
        >
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-[#3D2117] mb-1">
          {isEdit ? "Modify Reservation" : hotel?.name || "Booking Reservation"}
        </Text>
        <Text className="text-[#8E9BAE] text-sm mb-6">
          {isEdit
            ? `Updating your booking at ${hotel?.name}`
            : "Fill in details below to reserve your table"}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
        {/* Contact Info Banner - Only show if NOT logged in or if editing */}
        {(!user || isEdit) && (
          <TouchableOpacity
            onPress={() => setActiveModal("contact")}
            className={`flex-row items-center p-4 rounded-2xl mb-6 border ${contactComplete ? "border-green-200 bg-green-50" : "border-[#FFF5E9] bg-[#FFFBFA]"}`}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${contactComplete ? "bg-green-100" : "bg-[#FFF0E0]"}`}
            >
              <Ionicons
                name={contactComplete ? "checkmark-circle" : "person-outline"}
                size={20}
                color={contactComplete ? "#22c55e" : "#FF8A00"}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`font-bold text-sm ${contactComplete ? "text-green-700" : "text-[#3D2117]"}`}
              >
                {contactComplete
                  ? `${firstName} ${lastName}`
                  : "Add Your Contact Details"}
              </Text>
              <Text
                className={`text-xs mt-0.5 ${contactComplete ? "text-green-500" : "text-[#8E9BAE]"}`}
              >
                {contactComplete
                  ? email
                  : "Required for reservation confirmation"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#8E9BAE" />
          </TouchableOpacity>
        )}

        {/* Date */}
        <View className="mb-5">
          <Text className="text-[#8E9BAE] text-sm font-medium mb-3">
            Reservation Date
          </Text>
          <TouchableOpacity
            onPress={() => setActiveModal("date")}
            className="flex-row items-center justify-between border border-[#F1F5F9] p-5 rounded-2xl bg-white shadow-sm"
          >
            <Text className="text-base text-[#1A202C]">{formattedDate}</Text>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Time */}
        <View className="mb-5">
          <Text className="text-[#8E9BAE] text-sm font-medium mb-3">
            Reservation Time
          </Text>
          <TouchableOpacity
            onPress={() => setActiveModal("time")}
            className="flex-row items-center justify-between border border-[#F1F5F9] p-5 rounded-2xl bg-white shadow-sm"
          >
            <Text
              className={`text-base ${time ? "text-[#1A202C]" : "text-[#8E9BAE]"}`}
            >
              {time || "Select a time slot"}
            </Text>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Guests */}
        <View className="mb-5">
          <Text className="text-[#8E9BAE] text-sm font-medium mb-3">
            Number of Guests
          </Text>
          <TouchableOpacity
            onPress={() => setActiveModal("guests")}
            className="flex-row items-center justify-between border border-[#F1F5F9] p-5 rounded-2xl bg-white shadow-sm"
          >
            <Text
              className={`text-base ${guests ? "text-[#1A202C]" : "text-[#8E9BAE]"}`}
            >
              {guests
                ? `${guests} ${parseInt(guests) === 1 ? "Guest" : "Guests"}`
                : "Select party size"}
            </Text>
            <Ionicons name="people-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Seating */}
        <View className="mb-5">
          <Text className="text-[#8E9BAE] text-sm font-medium mb-3">
            Seating Preference
          </Text>
          <TouchableOpacity
            onPress={() => setActiveModal("seating")}
            className="flex-row items-center justify-between border border-[#F1F5F9] p-5 rounded-2xl bg-white shadow-sm"
          >
            <Text
              className={`text-base ${seating ? "text-[#1A202C]" : "text-[#8E9BAE]"}`}
            >
              {seating || "Select seating preference"}
            </Text>
            <Ionicons name="restaurant-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Bottom Action */}
      <View className="px-6 py-6 border-t border-[#F1F5F9]">
        <TouchableOpacity
          onPress={() => {
            if (!time) {
              showToast({
                message: "Please select a reservation time",
                type: "error",
              });
              setActiveModal("time");
              return;
            }
            if (!guests) {
              showToast({
                message: "Please select number of guests",
                type: "error",
              });
              setActiveModal("guests");
              return;
            }
            if (!seating) {
              showToast({
                message: "Please select seating preference",
                type: "error",
              });
              setActiveModal("seating");
              return;
            }
            setActiveModal("specialRequest");
          }}
          className="bg-[#007AFF] w-full py-5 rounded-2xl items-center shadow-sm"
        >
          <Text className="text-white text-lg font-bold">
            {isEdit ? "Continue to Update" : "Continue to Confirm"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shared Modal */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-[40px] px-8 pt-8 pb-10"
            style={{ maxHeight: height * 0.92 }}
          >
            <View className="flex-row justify-between items-center mb-6 border-b border-[#F1F5F9] pb-4">
              <Text className="text-xl font-bold text-[#3D2117]">
                {getTitle()}
              </Text>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons
                  name="close-circle-outline"
                  size={28}
                  color="#007AFF"
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {renderModalContent()}
            </ScrollView>

            <TouchableOpacity
              onPress={handleApply}
              disabled={submitting}
              className={`w-full py-5 rounded-2xl items-center mt-6 shadow-sm ${submitting ? "bg-gray-300" : "bg-[#007AFF]"}`}
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">
                  {getApplyLabel()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
