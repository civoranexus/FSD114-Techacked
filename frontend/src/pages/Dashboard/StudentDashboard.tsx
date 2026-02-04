import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import CourseCard, { Course } from '@/components/CourseCard';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/enrollments`, { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const enrolledCourses = enrollments.map(enrollment => ({
    id: enrollment.courseId._id || enrollment.courseId.id,
    title: enrollment.courseId.title,
    description: enrollment.courseId.description,
    instructor: enrollment.courseId.instructor || 'School',
    thumbnail: enrollment.courseId.thumbnail || '',
    category: enrollment.courseId.category || 'School Course',
    duration: `${enrollment.courseId.totalLessons} lessons`,
    studentsEnrolled: 0,
    rating: 0,
    price: enrollment.courseId.price,
    level: enrollment.courseId.level || 'Beginner',
    lessonsCount: enrollment.courseId.totalLessons,
    progress: enrollment.progress || 0,
    isEnrolled: true,
  }));

  const totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length)
    : 0;

  const completedCourses = enrolledCourses.filter(course => course.progress >= 100).length;

  // Build upcoming deadlines list (derived from enrolled courses).
  // Use placeholders when no explicit deadlines are available from the API.
  const upcomingDeadlines = enrolledCourses.slice(0, 3).map((course) => ({
    title: `${course.title} - Assignment`,
    course: course.title,
    dueDate: 'TBD',
    type: 'Assignment',
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue where you left off and track your learning progress.
            </p>
          </div>
          <Link to="/courses">
            <Button className="btn-primary-gradient">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Enrolled Courses"
            value={enrolledCourses.length.toString()}
            icon={BookOpen}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Hours Learned"
            value="0"
            icon={Clock}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Certificates Earned"
            value={completedCourses.toString()}
            icon={Trophy}
          />
          <StatCard
            title="Average Progress"
            value={`${totalProgress}%`}
            icon={TrendingUp}
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
              <Link to="/enrolled-courses" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Current Course Progress */}
            <div className="card-elevated p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={enrolledCourses[0]?.thumbnail || ''}
                    alt={enrolledCourses[0]?.title || 'Course'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                    <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                      <PlayCircle className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {enrolledCourses[0]?.title || 'No courses yet'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {enrolledCourses[0]?.instructor || 'School'}
                  </p>
                  {enrolledCourses[0] && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-primary">{enrolledCourses[0].progress}% complete</span>
                      </div>
                      <Progress value={enrolledCourses[0].progress} className="h-2" />
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-4">
                    {enrolledCourses[0] && (
                      <Link to={`/courses/${enrolledCourses[0].id}`}>
                        <Button size="sm" className="btn-primary-gradient">
                          Continue Course
                        </Button>
                      </Link>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Next: Continue learning
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Enrolled Courses */}
            <div className="grid md:grid-cols-2 gap-4">
              {enrolledCourses.slice(1).map((course) => (
                <CourseCard key={course.id} course={course} variant="compact" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="card-elevated p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {deadline.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {deadline.course}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-warning">
                          {deadline.dueDate}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {deadline.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/assessments">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Assessments
                </Button>
              </Link>
            </div>

            {/* Learning Streak */}
            <div className="card-elevated p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">7 Day Streak! 🔥</h3>
                <p className="text-sm text-muted-foreground">
                  You're on a roll! Keep learning to maintain your streak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
