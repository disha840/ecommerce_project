
"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiSearch,
    FiImage,
    FiX,
} from "react-icons/fi";

import api from "../../api";
import { toast } from "react-toastify";

import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading,
    Link,
    List,
    BlockQuote,
    Table,
    TableToolbar,
    SourceEditing,
    GeneralHtmlSupport,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const Banner = () => {
    const navigate = useNavigate();

    const [banners, setBanners] = useState([]);
    const [search, setSearch] = useState("");

    const [modal, setModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [htmlContent, setHtmlContent] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    // DECODE HTML
    const decodeHtml = (html = "") => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;
    };

    // FETCH BANNERS
    const getBanners = async () => {
        try {
            setLoading(true);

            const res = await api.get("/banner/get");

            setBanners(res.data.banners || res.data.data || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch banners"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBanners();
    }, []);

    // OPEN ADD MODAL
    const handleAdd = () => {
        setEditingBanner(null);
        setHtmlContent("");
        setModal(true);
    };

    // OPEN EDIT MODAL
    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setHtmlContent(decodeHtml(banner.htmlContent));
        setModal(true);
    };

    // CLOSE MODAL
    const handleCloseModal = () => {
        if (saving) return;

        setModal(false);
        setEditingBanner(null);
        setHtmlContent("");
    };

    // ADD / UPDATE BANNER
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!htmlContent.trim()) {
            toast.error("Please enter banner content");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                htmlContent,
            };

            if (editingBanner) {
                await api.put(
                    `/banner/update/${editingBanner._id}`,
                    payload
                );

                toast.success("Banner updated successfully");
            } else {
                await api.post("/banner/add", payload);

                toast.success("Banner added successfully");
            }

            setModal(false);
            setEditingBanner(null);
            setHtmlContent("");

            await getBanners();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    // DELETE BANNER
    const handleDelete = async () => {
        if (!bannerToDelete) return;

        try {
            setDeletingId(bannerToDelete._id);

            await api.delete(`/banner/delete/${bannerToDelete._id}`);

            toast.success("Banner deleted successfully");

            setBannerToDelete(null);

            await getBanners();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete banner"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // SEARCH BANNERS
    const filteredBanners = banners.filter((banner) =>
        (
            banner._id +
            " " +
            banner.htmlContent
        )
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen space-y-6 bg-[#F0FAFC] p-6 text-[#102A43]">

            {/* PAGE HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Banner Management
                    </h1>

                    <p className="mt-1 text-sm text-[#627D98]">
                        Create and manage website banners.
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779]"
                >
                    <FiPlus size={19} />
                    Add Banner
                </button>
            </div>

            {/* STATISTICS CARD */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-[#D9E8EF] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#627D98]">
                                Total Banners
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {banners.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-[#D7F2F6] p-3 text-[#087F95]">
                            <FiImage size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH */}
            <div className="rounded-2xl border border-[#D9E8EF] bg-white p-4 shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#627D98]"
                        size={19}
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search banners..."
                        className="w-full rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] py-2.5 pl-10 pr-4 text-sm text-[#102A43] outline-none transition placeholder:text-[#829AB1] focus:border-[#087F95] focus:ring-2 focus:ring-[#22B8CF]/20"
                    />
                </div>
            </div>

            {/* BANNER TABLE */}
            <div className="overflow-hidden rounded-2xl border border-[#D9E8EF] bg-white shadow-sm">
                <div className="border-b border-[#D9E8EF] p-5">
                    <h2 className="font-semibold text-[#102A43]">
                        All Banners
                    </h2>

                    <p className="mt-1 text-sm text-[#627D98]">
                        View and manage your website banners.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-[#D9E8EF] bg-[#F8FCFD]">
                            <tr>
                                {[
                                    "S.No.",
                                    "Banner Preview",
                                    "Created At",
                                    "Updated At",
                                    "Actions",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[#627D98]"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#D9E8EF]">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-10 text-center text-sm text-[#627D98]"
                                    >
                                        Loading banners...
                                    </td>
                                </tr>
                            ) : filteredBanners.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-10 text-center text-sm text-[#627D98]"
                                    >
                                        No banners found
                                    </td>
                                </tr>
                            ) : (
                                filteredBanners.map((banner, index) => (
                                    <tr
                                        key={banner._id}
                                        className="transition hover:bg-[#F8FCFD]"
                                    >
                                        {/* SERIAL NUMBER */}
                                        <td className="px-6 py-4 text-sm text-[#627D98]">
                                            {index + 1}
                                        </td>

                                        {/* PREVIEW */}
                                        <td className="px-6 py-4">
                                            <div className="overflow-hidden rounded-xl border border-[#D9E8EF] bg-[#F8FCFD] p-1">
                                                <iframe
                                                    title={`Banner ${index + 1}`}
                                                    srcDoc={decodeHtml(
                                                        banner.htmlContent
                                                    )}
                                                    className="h-24 w-64 rounded-lg bg-white"
                                                    sandbox=""
                                                />
                                            </div>
                                        </td>

                                        {/* CREATED DATE */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#627D98]">
                                            {banner.createdAt
                                                ? new Date(
                                                    banner.createdAt
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        {/* UPDATED DATE */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-[#627D98]">
                                            {banner.updatedAt
                                                ? new Date(
                                                    banner.updatedAt
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/banner/${banner._id}`
                                                        )
                                                    }
                                                    title="View Banner"
                                                    className="rounded-lg p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                                                >
                                                    <FiEye size={18} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleEdit(banner)
                                                    }
                                                    title="Edit Banner"
                                                    className="rounded-lg p-2 text-[#087F95] transition hover:bg-[#D7F2F6]"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setBannerToDelete(banner)
                                                    }
                                                    title="Delete Banner"
                                                    className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#F0FAFC] hover:text-red-600"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD / EDIT MODAL */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#D9E8EF] bg-white shadow-xl">

                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D9E8EF] bg-white p-5">
                            <div>
                                <h2 className="text-xl font-bold text-[#102A43]">
                                    {editingBanner
                                        ? "Edit Banner"
                                        : "Add Banner"}
                                </h2>

                                <p className="mt-1 text-sm text-[#627D98]">
                                    Add your banner HTML content.
                                </p>
                            </div>

                            <button
                                onClick={handleCloseModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-[#627D98] transition hover:bg-[#D7F2F6] hover:text-[#087F95]"
                            >
                                <FiX size={22} />
                            </button>
                        </div>

                        {/* MODAL FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#102A43]">
                                    Banner Content
                                </label>

                                <div className="overflow-hidden rounded-xl border border-[#D9E8EF]">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={htmlContent}
                                        config={{
                                            licenseKey: "GPL",

                                            plugins: [
                                                Essentials,
                                                Paragraph,
                                                Bold,
                                                Italic,
                                                Underline,
                                                Strikethrough,
                                                Heading,
                                                Link,
                                                List,
                                                BlockQuote,
                                                Table,
                                                TableToolbar,
                                                SourceEditing,
                                                GeneralHtmlSupport,
                                            ],

                                            toolbar: [
                                                "undo",
                                                "redo",
                                                "|",
                                                "heading",
                                                "|",
                                                "bold",
                                                "italic",
                                                "underline",
                                                "strikethrough",
                                                "|",
                                                "link",
                                                "bulletedList",
                                                "numberedList",
                                                "|",
                                                "insertTable",
                                                "blockQuote",
                                                "sourceEditing",
                                            ],

                                            htmlSupport: {
                                                allow: [
                                                    {
                                                        name: /.*/,
                                                        attributes: true,
                                                        classes: true,
                                                        styles: true,
                                                    },
                                                ],
                                            },

                                            table: {
                                                contentToolbar: [
                                                    "tableColumn",
                                                    "tableRow",
                                                    "mergeTableCells",
                                                ],
                                            },
                                        }}
                                        onChange={(event, editor) => {
                                            setHtmlContent(editor.getData());
                                        }}
                                    />
                                </div>
                            </div>

                            {/* FORM BUTTONS */}
                            <div className="flex flex-wrap justify-end gap-3 border-t border-[#D9E8EF] pt-5">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                    className="rounded-xl border border-[#D9E8EF] px-5 py-2.5 text-sm font-semibold text-[#627D98] transition hover:bg-[#F0FAFC] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[#087F95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#066779] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingBanner
                                            ? "Update Banner"
                                            : "Add Banner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {bannerToDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#102A43]/50 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-[#D9E8EF] bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-xl bg-[#F0FAFC] p-3 text-[#087F95]">
                                <FiTrash2 size={22} />
                            </div>

                            <h2 className="text-lg font-bold text-[#102A43]">
                                Delete Banner?
                            </h2>
                        </div>

                        <p className="text-sm leading-6 text-[#627D98]">
                            Are you sure you want to delete this banner?
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setBannerToDelete(null)}
                                disabled={deletingId !== null}
                                className="rounded-xl border border-[#D9E8EF] px-5 py-2.5 text-sm font-semibold text-[#627D98] transition hover:bg-[#F0FAFC] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deletingId !== null}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {deletingId ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banner;
