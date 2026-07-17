'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
} from 'firebase/firestore';
import { db } from '@/firebase/client';
import { COLLECTIONS } from '@/constants';
import type { Inquiry, InquiryActivity, InquiryStatus, LeadTemperature, User as DbUser } from '@/types';
import { 
  updateInquiryStatusAction, 
  updateInquiryTemperatureAction, 
  deleteInquiryAction,
  addInquiryNoteAction,
  createInquiryAction
} from '@/actions/inquiries';
import { exportInquiriesCsvAction } from '@/actions/reports';
import { useAuth } from '@/context/auth-context';
import { getAdminUsersAction } from '@/actions/auth';
import { 
  Search, 
  Flame, 
  Snowflake, 
  CheckCircle2, 
  MessageSquare, 
  Trash2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ArrowUpDown, 
  RefreshCw, 
  Calendar, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  ExternalLink,
  Plus,
  Loader2,
  ArrowRight,
  FileDown,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const formatDate = (date: Date | any) => {
  if (!date) return 'N/A';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function InquiriesDashboard() {
  const { user: currentUser } = useAuth();
  const searchParams = useSearchParams();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activities, setActivities] = useState<InquiryActivity[]>([]);
  const [calculations, setCalculations] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const selectedInquiry = inquiries.find(i => i.id === selectedInquiryId) || null;

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const res = await getAdminUsersAction();
        if (res.success && res.data) {
          setAdminUsers(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin users:', err);
      }
    };
    fetchAdminUsers();
  }, []);

  const handleExportInquiries = async () => {
    setLeadLoading(true);
    try {
      const response = await exportInquiriesCsvAction();
      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'crm_leads_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(response.error || 'Failed to export inquiries.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to trigger CRM CSV export.');
    } finally {
      setLeadLoading(false);
    }
  };

  // New Inquiry form state
  const [showCreateForm, setShowCreateForm] = useState(() => searchParams.get('new') === 'true');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('$10k - $25k');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCreateInquiry = async (status: 'new' | 'contacted' = 'new') => {
    if (!name.trim() || !company.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setSubmitError('All fields are required.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await createInquiryAction({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        budget,
        message: message.trim(),
      });
      if (response.success) {
        setName('');
        setCompany('');
        setEmail('');
        setPhone('');
        setMessage('');
        setShowCreateForm(false);
      } else {
        setSubmitError(response.error || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [tempFilter, setTempFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Pagination & Sorting state
  const [visibleCount, setVisibleCount] = useState(7);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortField, setSortField] = useState<'companyName' | 'budget' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Drawer note state
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    const inquiriesQuery = query(
      collection(db, COLLECTIONS.INQUIRIES), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
      const inqList: Inquiry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        inqList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt),
          followUpDate: data.followUpDate?.toDate ? data.followUpDate.toDate() : data.followUpDate ? new Date(data.followUpDate) : null,
        } as Inquiry);
      });
      setInquiries(inqList);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Inquiries error:", error);
      setLoading(false);
    });

    const activitiesQuery = query(
      collection(db, COLLECTIONS.INQUIRY_ACTIVITIES),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeActivities = onSnapshot(activitiesQuery, (snapshot) => {
      const actList: InquiryActivity[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        actList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        } as InquiryActivity);
      });
      setActivities(actList);
    });

    const calculationsQuery = query(
      collection(db, COLLECTIONS.CALCULATIONS)
    );

    const unsubscribeCalculations = onSnapshot(calculationsQuery, (snapshot) => {
      const calcList: any[] = [];
      snapshot.forEach((doc) => {
        calcList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setCalculations(calcList);
    });

    return () => {
      unsubscribeInquiries();
      unsubscribeActivities();
      unsubscribeCalculations();
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await updateInquiryStatusAction(id, { status: newStatus });
      if (!res.success) {
        toast.error(res.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating status.');
    }
  };

  const handleAssigneeChange = async (id: string, newAssigneeId: string | null) => {
    try {
      const inq = inquiries.find(i => i.id === id);
      if (!inq) return;
      const res = await updateInquiryStatusAction(id, { 
        status: inq.status, 
        assignedTo: newAssigneeId 
      });
      if (!res.success) {
        toast.error(res.error || 'Failed to update assignment.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating assignment.');
    }
  };

  const handleTempChange = async (id: string, newTemp: LeadTemperature) => {
    try {
      await updateInquiryTemperatureAction(id, newTemp);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: string) => {
    toast('Delete this inquiry?', {
      description: 'This will also remove its audit trail.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await deleteInquiryAction(id);
            if (selectedInquiryId === id) {
              setDrawerOpen(false);
              setSelectedInquiryId(null);
            }
            toast.success('Inquiry deleted.');
          } catch (err) {
            console.error(err);
            toast.error('Failed to delete inquiry.');
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await addInquiryNoteAction(selectedInquiry.id, newNote);
      if (res.success) {
        setNewNote('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        const matchesSearch = 
          inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inq.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTemp = tempFilter === 'all' || inq.temperature === tempFilter;
        const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
        
        let matchesBudget = true;
        if (budgetFilter !== 'all') {
          const budgetNum = parseInt(inq.budget.replace(/[^0-9]/g, ''), 10) || 0;
          if (budgetFilter === '50,000') matchesBudget = budgetNum < 100000;
          else if (budgetFilter === '1,00,000') matchesBudget = budgetNum >= 100000 && budgetNum <= 250000;
          else if (budgetFilter === '2,50,000') matchesBudget = budgetNum > 250000;
        }

        let matchesDate = true;
        if (startDate || endDate) {
          const inqTime = new Date(inq.createdAt).getTime();
          if (startDate) {
            const start = new Date(startDate).getTime();
            if (inqTime < start) matchesDate = false;
          }
          if (endDate) {
            const end = new Date(endDate).setHours(23, 59, 59, 999);
            if (inqTime > end) matchesDate = false;
          }
        }

        return matchesSearch && matchesTemp && matchesStatus && matchesBudget && matchesDate;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'budget') {
          const parseVal = (str: string) => parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
          valA = parseVal(valA);
          valB = parseVal(valB);
        } else if (sortField === 'createdAt') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        } else {
          valA = String(valA).toLowerCase();
          valB = String(valB).toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [inquiries, searchTerm, tempFilter, statusFilter, budgetFilter, startDate, endDate, sortField, sortDirection]);

  const visibleInquiries = useMemo(() => {
    return filteredInquiries.slice(0, visibleCount);
  }, [filteredInquiries, visibleCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 7);
      setIsLoadingMore(false);
    }, 400);
  };

  const [prevFilterKeys, setPrevFilterKeys] = useState('');
  const currentFilterKeys = `${searchTerm}-${tempFilter}-${statusFilter}-${budgetFilter}-${startDate}-${endDate}`;
  if (currentFilterKeys !== prevFilterKeys) {
    setPrevFilterKeys(currentFilterKeys);
    setVisibleCount(7);
  }

  const kpiData = useMemo(() => {
    const total = inquiries.length;
    const hot = inquiries.filter(i => i.temperature === 'hot').length;
    const cold = inquiries.filter(i => i.temperature === 'cold').length;
    const converted = inquiries.filter(i => i.status === 'converted').length;
    return { total, hot, cold, converted };
  }, [inquiries]);

  const selectedInquiryActivities = useMemo(() => {
    if (!selectedInquiry) return [];
    return activities.filter(act => act.inquiryId === selectedInquiry.id);
  }, [activities, selectedInquiry]);

  const selectedInquiryNotes = useMemo(() => {
    return selectedInquiryActivities.filter(act => act.action === 'Admin Comment Added');
  }, [selectedInquiryActivities]);

  const linkedCalculation = useMemo(() => {
    if (!selectedInquiry || !selectedInquiry.calculationId) return null;
    return calculations.find(c => c.id === selectedInquiry.calculationId);
  }, [selectedInquiry, calculations]);

  const requestSort = (field: 'companyName' | 'budget' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-8 min-h-screen text-foreground font-sans pb-12 relative animate-in fade-in duration-500">
        {/* Soft background glow */}
        <div className="absolute top-[-5%] left-[10%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-20" />

        {/* Back navigation */}
        <button
          onClick={() => {
            setShowCreateForm(false);
            setSubmitError(null);
          }}
          className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:opacity-85 transition-opacity cursor-pointer uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Inquiries
        </button>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">New Consultation Inquiry</h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Initialize a new strategic consultation request. This form captures high-level executive requirements to match your project with our senior leadership team.
          </p>
        </div>

        {submitError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-bold max-w-5xl">
            {submitError}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl items-start">
          {/* Left Column Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Identity & Contact Card */}
            <div className="bg-card rounded-2xl p-6 border border-border space-y-6 shadow-sm">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-l-2 border-primary pl-2.5">
                Identity & Contact
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Julian Montgomery"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Quantum Dynamics Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    placeholder="j.montgomery@quantum.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </div>

            {/* Project Parameters Card */}
            <div className="bg-card rounded-2xl p-6 border border-border space-y-6 shadow-sm">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest border-l-2 border-primary pl-2.5">
                Project Parameters
              </h3>

              {/* Budget selector buttons */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Target Budget Range</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['$10k - $25k', '$25k - $50k', '$50k - $100k', '$100k+'].map((range) => {
                    const isSelected = budget === range;
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setBudget(range)}
                        className={`py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requirements textarea */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Detailed Requirements</label>
                <textarea
                  rows={6}
                  placeholder="Please describe the core challenges, project scope, and desired outcomes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border border-border bg-card text-foreground text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
                />
              </div>
            </div>

            {/* Form submit controls */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setSubmitError(null);
                }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                Cancel Draft
              </button>
              <button
                type="button"
                onClick={() => handleCreateInquiry()}
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Inquiry
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column Info panels */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Response Timeline Info Box */}
            <div className="p-5 bg-card border border-border rounded-2xl space-y-3.5 shadow-sm">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Response Timeline
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Our typical executive review turnaround for new inquiries is <span className="font-bold text-primary">24-48 business hours</span>.
              </p>
              <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[9px] font-bold text-muted-foreground tracking-wider uppercase">
                <span>QUEUE STATUS:</span>
                <span className="text-emerald-500">4 ACTIVE REVIEWS</span>
              </div>
            </div>

            {/* Expertise Focus */}
            <div className="p-5 bg-card border border-border rounded-2xl space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-foreground">Expertise Focus</h4>
              
              <div className="space-y-3 text-[11px] leading-relaxed">
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Systems Architecture</span>
                    <span className="text-muted-foreground">High-load distributed network planning.</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Market Strategy</span>
                    <span className="text-muted-foreground">SaaS scaling and product positioning.</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Data Compliance</span>
                    <span className="text-muted-foreground">GDPR and international data protocols.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic card */}
            <div className="p-6 bg-gradient-to-br from-primary to-[#712ae2] text-white rounded-2xl space-y-2 shadow-md">
              <h4 className="font-extrabold text-sm leading-tight">Empowering Global Scale Consulting</h4>
              <p className="text-[10px] text-white/80 leading-relaxed font-medium">
                Designing systems optimized for conversions, robust security auditing, and seamless API / CRM orchestrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-screen text-foreground font-sans pb-12 relative">
      {/* Background Soft Glow */}
      <div className="absolute top-[-5%] left-[10%] w-[35%] h-[35%] bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none -z-20" />

      {/* Top Title/Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            CRM Lead Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track inquiries, manage temperatures, and optimize conversions for AdaptWeb.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleExportInquiries}
            disabled={leadLoading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {leadLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileDown className="w-3.5 h-3.5" />
            )}
            Export CRM Report (CSV)
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary/95 text-white transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Inquiry
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-card border border-border hover:border-cyan-500/30 text-foreground transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="p-5 rounded-3xl glass-bento ambient-glow-purple border border-border/50 shadow-sm relative overflow-hidden group haptic-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Total Inquiries</span>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold tracking-tight">{kpiData.total}</h2>
            <p className="text-xs text-muted-foreground mt-1">Inquiries logged from calculator</p>
          </div>
        </div>

        {/* Hot Leads */}
        <div className="p-5 rounded-3xl glass-bento ambient-glow-amber border border-border/50 shadow-sm relative overflow-hidden group haptic-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-500 tracking-wide uppercase">🔥 Hot Leads</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold tracking-tight">{kpiData.hot}</h2>
            <p className="text-xs text-muted-foreground mt-1">Immediate follow-up required</p>
          </div>
        </div>

        {/* Cold Leads */}
        <div className="p-5 rounded-3xl glass-bento ambient-glow-cyan border border-border/50 shadow-sm relative overflow-hidden group haptic-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-500 tracking-wide uppercase">❄️ Cold Leads</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Snowflake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold tracking-tight">{kpiData.cold}</h2>
            <p className="text-xs text-muted-foreground mt-1">Requires nurturing campaign</p>
          </div>
        </div>

        {/* Converted Leads */}
        <div className="p-5 rounded-3xl glass-bento ambient-glow-emerald border border-border/50 shadow-sm relative overflow-hidden group haptic-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-500 tracking-wide uppercase">✅ Converted</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold tracking-tight">{kpiData.converted}</h2>
            <p className="text-xs text-muted-foreground mt-1">Closed won paying customers</p>
          </div>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="rounded-3xl border border-border/50 bg-card p-6 space-y-6 shadow-sm">
        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search company, contact, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          <Select value={tempFilter} onValueChange={(val) => setTempFilter(val ?? 'all')}>
            <SelectTrigger className="w-full h-10 px-4 py-2.5 rounded-xl border border-border text-sm">
              <SelectValue placeholder="All Temperatures" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Temperatures</SelectItem>
              <SelectItem value="hot">🔥 Hot Lead</SelectItem>
              <SelectItem value="cold">❄️ Cold Lead</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? 'all')}>
            <SelectTrigger className="w-full h-10 px-4 py-2.5 rounded-xl border border-border text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">🆕 New</SelectItem>
              <SelectItem value="contacted">📞 Contacted</SelectItem>
              <SelectItem value="proposal_sent">✉️ Proposal Sent</SelectItem>
              <SelectItem value="converted">✅ Converted</SelectItem>
              <SelectItem value="lost">❌ Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={budgetFilter} onValueChange={(val) => setBudgetFilter(val ?? 'all')}>
            <SelectTrigger className="w-full h-10 px-4 py-2.5 rounded-xl border border-border text-sm">
              <SelectValue placeholder="All Budgets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="50,000">Below ₹1,00,000</SelectItem>
              <SelectItem value="1,00,000">₹1,00,000 - ₹2,50,000</SelectItem>
              <SelectItem value="2,50,000">₹2,50,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Ranges Row */}
        <div className="flex flex-wrap items-center gap-4 border-t border-border/40 pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span>Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-cyan-500/50"
            />
            <span className="text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          {(startDate || endDate || searchTerm || tempFilter !== 'all' || statusFilter !== 'all' || budgetFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTempFilter('all');
                setStatusFilter('all');
                setBudgetFilter('all');
                setStartDate('');
                setEndDate('');
              }}
              className="ml-auto text-xs text-[#06b6d4] hover:text-[#06b6d4]/80 underline underline-offset-4 cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Table / Loading */}
        {loading ? (
          <div className="space-y-4 py-8">
            <div className="h-10 bg-muted rounded-xl animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-inner">
              <Building2 className="w-8 h-8 opacity-40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No inquiries yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Customer inquiries submitted from the Website Calculator will appear here.
              </p>
            </div>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md cursor-pointer"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-2xl relative">
            <table className="w-full border-collapse text-left text-sm text-foreground">
              <thead className="bg-muted sticky top-0 border-b border-border z-10">
                <tr>
                  <th onClick={() => requestSort('companyName')} className="px-6 py-4 font-semibold select-none cursor-pointer hover:text-cyan-500 transition-colors pl-6">
                    <div className="flex items-center gap-1.5">
                      Company / Name
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Primary Contact</th>
                  <th onClick={() => requestSort('budget')} className="px-6 py-4 font-semibold select-none cursor-pointer hover:text-cyan-500 transition-colors">
                    <div className="flex items-center gap-1.5">
                      Est. Budget
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Lead Temperature</th>
                  <th className="px-6 py-4 font-semibold">Lead Status</th>
                  <th onClick={() => requestSort('createdAt')} className="px-6 py-4 font-semibold select-none cursor-pointer hover:text-cyan-500 transition-colors">
                    <div className="flex items-center gap-1.5">
                      Inquiry Date
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/55">
                {visibleInquiries.map((inq) => (
                  <tr 
                    key={inq.id} 
                    className="hover:bg-muted/30 transition-colors group border-b border-border/40"
                  >
                    <td className="px-6 py-4.5 pl-6">
                      <div className="flex flex-col">
                        <span className="font-semibold group-hover:text-cyan-500 transition-colors">
                          {inq.companyName}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {inq.phone}
                        </span>
                        {inq.assignedTo && (
                          <div className="mt-1.5 flex items-center gap-1 text-[9px] text-[#06b6d4] font-bold bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-1.5 py-0.5 rounded w-max uppercase tracking-wider">
                            <User className="w-2.5 h-2.5" />
                            {adminUsers.find(u => u.id === inq.assignedTo)?.name || 'Assigned'}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="flex flex-col">
                        <span className="font-medium">{inq.name}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{inq.email}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      {(() => {
                        const calc = inq.calculationId ? calculations.find(c => c.id === inq.calculationId) : null;
                        return (
                          <div className="flex flex-col">
                            <span className="font-semibold">{inq.budget}</span>
                            {calc && (
                              <div className="mt-1 flex flex-col gap-0.5">
                                <span className="text-[10px] text-cyan-500 font-bold block truncate max-w-[150px]">
                                  {calc.packageName}
                                </span>
                                <span className="text-[10px] text-emerald-500 font-extrabold block">
                                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(calc.total)}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    <td className="px-6 py-4.5">
                      <Select 
                        value={inq.temperature || 'cold'} 
                        onValueChange={(val) => handleTempChange(inq.id, (val ?? 'cold') as LeadTemperature)}
                      >
                        <SelectTrigger className={`h-8 text-xs font-bold px-2.5 py-1.5 rounded-lg border-0 shadow-none ${
                          inq.temperature === 'hot' 
                            ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-red-500/20 text-orange-400' 
                            : 'bg-background border border-border text-muted-foreground'
                        }`}>
                          <SelectValue placeholder="Cold Lead" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cold">❄️ Cold Lead</SelectItem>
                          <SelectItem value="hot">🔥 Hot Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td className="px-6 py-4.5">
                      {(() => {
                        const isDisabled = !!(inq.assignedTo && inq.assignedTo !== currentUser?.id);
                        return (
                          <div className="relative group">
                            <Select 
                              value={inq.status} 
                              disabled={isDisabled}
                              onValueChange={(val) => handleStatusChange(inq.id, (val ?? 'new') as InquiryStatus)}
                            >
                              <SelectTrigger className={`h-8 text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 shadow-none ${
                                isDisabled ? 'opacity-50 pointer-events-none' : ''
                              } ${
                                inq.status === 'new' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                                inq.status === 'contacted' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                                inq.status === 'proposal_sent' ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' :
                                inq.status === 'converted' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
                                'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                              }`}>
                                <SelectValue placeholder="New" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">🆕 New</SelectItem>
                                <SelectItem value="contacted">📞 Contacted</SelectItem>
                                <SelectItem value="proposal_sent">✉️ Proposal</SelectItem>
                                <SelectItem value="converted">✅ Converted</SelectItem>
                                <SelectItem value="lost">❌ Lost</SelectItem>
                              </SelectContent>
                            </Select>
                            {isDisabled && (
                              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block z-30 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-bold px-2.5 py-1 rounded-xl shadow-md whitespace-nowrap">
                                Only the assigned member can update status
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    <td className="px-6 py-4.5 text-muted-foreground text-xs">
                      {formatDate(inq.createdAt)}
                    </td>

                    <td className="px-6 py-4.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedInquiryId(inq.id);
                            setDrawerOpen(true);
                          }}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-[#06b6d4] hover:border-[#06b6d4]/40 transition-all shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-all shadow-sm cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Load More Controls */}
        {!loading && filteredInquiries.length > visibleCount && (
          <div className="flex flex-col items-center gap-2 pt-4 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
              Showing {Math.min(visibleCount, filteredInquiries.length)} of {filteredInquiries.length} Inquiries
            </p>
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl px-6 py-2.5 shadow-md cursor-pointer text-xs disabled:opacity-50 min-w-44 justify-center"
            >
              {isLoadingMore ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {isLoadingMore ? 'Syncing...' : `Load More (+7)`}
            </button>
          </div>
        )}
      </div>

      {/* Right Drawer Panel (Framer Motion) */}
      <AnimatePresence>
        {drawerOpen && selectedInquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card border-l border-border/80 shadow-2xl p-6 overflow-y-auto z-50 flex flex-col gap-6"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div>
                  <span className="text-xs font-bold text-[#06b6d4] tracking-widest uppercase font-mono">Lead Workspace</span>
                  <h3 className="text-lg font-bold mt-1">{selectedInquiry.companyName}</h3>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Info Card */}
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Primary Contact</span>
                    <span className="text-sm font-semibold">{selectedInquiry.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-500" /> Email
                    </span>
                    <a href={`mailto:${selectedInquiry.email}`} className="font-semibold text-foreground hover:text-cyan-500 transition-colors block truncate">{selectedInquiry.email}</a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-500" /> Phone
                    </span>
                    <a href={`tel:${selectedInquiry.phone}`} className="font-semibold text-foreground hover:text-cyan-500 transition-colors block truncate">{selectedInquiry.phone}</a>
                  </div>
                </div>
              </div>

              {/* Lead Assignment Card */}
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-3.5 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Assigned Member</span>
                    <Select 
                      value={selectedInquiry.assignedTo || 'unassigned'} 
                      onValueChange={(val) => handleAssigneeChange(selectedInquiry.id, val === 'unassigned' ? null : val)}
                    >
                      <SelectTrigger className="w-full h-8 mt-1 border border-border">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {adminUsers.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name} ({u.role === 'super_admin' ? 'Super Admin' : 'Admin'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Linked Calculation Detailed Workspace */}
              {linkedCalculation && (
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border/30">
                    <span className="text-xs font-bold text-[#06b6d4] flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <Calculator className="w-3.5 h-3.5 text-[#06b6d4]" />
                      Cost Estimation Details
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Recommended Tier</span>
                      <span className="font-bold text-foreground">{linkedCalculation.packageName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Website Type</span>
                      <span className="font-bold text-foreground capitalize">{linkedCalculation.websiteType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Pages Count</span>
                      <span className="font-bold text-foreground">{linkedCalculation.pages} Pages</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Estimated Timeline</span>
                      <span className="font-bold text-primary">
                        {linkedCalculation.estimatedDays 
                          ? `${Math.ceil(linkedCalculation.estimatedDays / 7)} Weeks (${linkedCalculation.estimatedDays} Days)` 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Selected Features list */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Selected Feature Modules</span>
                    {linkedCalculation.selectedFeatures && linkedCalculation.selectedFeatures.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {linkedCalculation.selectedFeatures.map((feat: any) => (
                          <span 
                            key={feat.featureId} 
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/15"
                          >
                            {feat.featureName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No additional features selected.</span>
                    )}
                  </div>

                  {/* Total Quote Value */}
                  <div className="pt-2.5 border-t border-border/30 flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">Calculated Quote Total:</span>
                    <span className="text-emerald-500 font-extrabold text-sm">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(linkedCalculation.total)}
                    </span>
                  </div>
                </div>
              )}

              {/* Fallback basic budget reference if no calculation is loaded */}
              {!linkedCalculation && selectedInquiry.calculationId && (
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border/30">
                    <span className="text-xs font-semibold text-foreground">Linked Estimation Quote</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Budget Bracket</span>
                      <span className="font-bold text-foreground">{selectedInquiry.budget}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Quote Reference</span>
                      <span className="font-mono text-muted-foreground block truncate">{selectedInquiry.calculationId}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements Message */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Requirements / Message</span>
                <div className="p-4 rounded-2xl border border-border/50 bg-background text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {selectedInquiry.message || "No description provided."}
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="space-y-4 pt-2 border-t border-border/40">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Internal CRM Notes</span>
                
                <form onSubmit={handleAddNote} className="space-y-3">
                  <textarea
                    placeholder="Type an internal note or sales follow-up details..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingNote || !newNote.trim()}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Sales Note
                    </button>
                  </div>
                </form>

                {/* Notes History list */}
                <div className="space-y-3.5">
                  {selectedInquiryNotes.length > 0 ? (
                    selectedInquiryNotes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-xl border border-border/40 bg-muted/20 space-y-1.5">
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{note.note}</p>
                        <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                          <span className="font-semibold">{note.createdBy || 'System'}</span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No internal notes added yet.</p>
                  )}
                </div>
              </div>

              {/* Activity Logs Timeline */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Activity Logs</span>
                
                <div className="space-y-4">
                  {selectedInquiryActivities.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center">No logs generated.</p>
                  ) : (
                    <div className="relative pl-4 border-l border-border/50 space-y-4 text-xs">
                      {selectedInquiryActivities.map((act) => (
                        <div key={act.id} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 border border-card" />
                          <div className="font-semibold text-foreground">{act.action}</div>
                          {act.note && <div className="text-muted-foreground mt-0.5">{act.note}</div>}
                          <div className="text-[10px] text-muted-foreground mt-1 flex justify-between">
                            <span>By {act.createdBy}</span>
                            <span>{formatDate(act.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
