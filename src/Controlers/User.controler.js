import { asyncHandler } from "../Utiles/AscynHandler.js";
import { ApiError } from "../Utiles/ApiError.js";
import { User } from "../Models/user.Models.js";
import { Apiresponse } from "../Utiles/ApiResponse.js";
import jwt from "jsonwebtoken";
import validator from "validator";

// Helper function to generate access and refresh tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// User Registration
const registerUser = asyncHandler(async (req, res) => {
  try {
     
    
    const { fullName, email, password} = req.body;
     
    if (
      [fullName, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    console.log("after validation");
    
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Email Id is not valid");
    }

    const exitedUser = await User.findOne({
      $or: [{ email }],
    });
    if (exitedUser) {
      throw new ApiError(409, " Email is already exist");
    }
    console.log("after email check");
    
    if (password.length < 8) {
      throw new ApiError(
        400,
        "Password should strong and it contain minimum 8 lenght"
      );
    }
    const user = await User.create({
      fullName,
      email,
      password,
    });
    console.log("after user creation");
    const createUser = await User.findById(user._id).select(
      "-password  -refreshtoken"
    );
    if (!createUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(201)
      .json(new Apiresponse(200, { user: createUser }, "user registered Successfully"));
  } catch (error) {
    // If ApiError → use its status and message
    const status = error.statusCode || 500;
  
    return res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Registration failed")
      );
  }
});

// User Login
const loginuser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Email and password is required");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Email Id is not valid");
    }
    if (password.length < 8) {
      throw new ApiError(
        400,
        "Password should strong and it contain minimum 8 lenght"
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user's password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const loggedInuser = await User.findById(user._id).select(
      " -password  -refreshToken"
    );
    
    return res
      .status(200)
      .json(
        new Apiresponse(
          200,
          {
            user: loggedInuser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(new Apiresponse(status, null, error.message || "Login failed"));
  }
});

// User Logout
const LogoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
   

    return res
      .status(200)
      .json(new Apiresponse(200, {}, "User logged Out"));
  } catch (error) {
    return res.status(500).json(new Apiresponse(500, null, "Logout failed"));
  }
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // 1. Get refresh token from body or cookies
    const incomingRefreshToken =
      req.body?.refreshToken 

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 2. Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 3. Find user
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // 4. Match refresh token with DB
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or already used");
    }

    // 5. Generate new tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user._id);

    // 6. Send response
    return res
      .status(200)
      .json(
        new Apiresponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
      const status = error.statusCode || 500;
      return res
         .status(status)
         .json(
             new Apiresponse(
                   status,
                     null,
                     error.message || "Could not refresh access token"
                   )
                 );
  }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  try {
    
    const { oldPassword, NewPassword } = req.body;
    
    const user = await User.findById(req.user._id);
  
    const ispassword = await user.isPasswordCorrect(oldPassword);
    if (!ispassword) {
      throw new ApiError(401, "Invalid old password");
    }

    user.password = NewPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new Apiresponse(200, {}, "Password changed successfuly"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Could not change password"
        )
      );
  }
});



export {
  registerUser,
  loginuser,
  LogoutUser,
  refreshAccessToken,
  changePassword,
 
};
