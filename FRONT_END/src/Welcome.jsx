import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 text-white px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Organize Your Tasks.
            <br />
            <span className="text-indigo-400"> Achieve Your Goals </span>
          </h1>

          <p className="mt-6 text-lg text-white/90">
            Manage your daily tasks, follow structured 30 or 90 day plans, and
            track your progress with a powerful and intuitive dashboard.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:scale-105 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
