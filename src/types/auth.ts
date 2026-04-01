export interface User {
  id: string
  email: string
  name: string
  role: string
  dateOfBirth: string | null
  phoneNumber: string | null
  address: string | null
  avatarUrl: string | null
  isVerified: boolean
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthPayload {
  token: string
  user: User
}

export interface SignupPayload {
  name: string
  email: string
  phone_number: string
  date_of_birth: string
  address: string
  otp: string
}

export interface CheckEmailResponse {
  exists: boolean
}
