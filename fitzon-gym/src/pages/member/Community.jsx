import { useState, useContext, useEffect } from 'react';
import MemberSidebar from '../../components/member/MemberSidebar';
import { AuthContext } from '../../context/AuthContext';
import { getCommunityPosts, saveCommunityPosts, getMembers } from '../../utils/localStorage';
import { MessageSquare, ThumbsUp, Send, Trophy, Medal } from 'lucide-react';
import toast from 'react-hot-toast';

const Community = () => {
    const { currentUser } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Generate some initial mocked posts if empty
        let storedPosts = getCommunityPosts();
        if (storedPosts.length === 0) {
            storedPosts = [
                { id: 1, authorId: 'm1', authorName: 'Ahmed Khan', text: 'Just hit a new PR on deadlifts! 180kg let\'s gooo! 💪🔥', time: '2 hours ago', likes: 12, isLiked: false },
                { id: 2, authorId: 'm2', authorName: 'Sara Malik', text: 'The HIIT class with Arnold was brutal today. Anyone else feeling their legs shaking? 😂', time: '5 hours ago', likes: 24, isLiked: false },
                { id: 3, authorId: 'm7', authorName: 'Hassan Mirza', text: 'Looking for a spotter tomorrow morning around 7am. Any takers?', time: '1 day ago', likes: 5, isLiked: false }
            ];
            saveCommunityPosts(storedPosts);
        }
        setPosts(storedPosts);

        // Calculate leaderboard based on classes attended
        const members = getMembers();
        const sortedMembers = [...members].sort((a, b) => b.classesAttended - a.classesAttended).slice(0, 5);
        setLeaderboard(sortedMembers);
    }, []);

    const handlePost = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const post = {
            id: Date.now(),
            authorId: currentUser.id,
            authorName: currentUser.name,
            text: newPost,
            time: 'Just now',
            likes: 0,
            isLiked: false
        };

        const updatedPosts = [post, ...posts];
        setPosts(updatedPosts);
        saveCommunityPosts(updatedPosts);
        setNewPost('');
        toast.success('Posted successfully');
    };

    const toggleLike = (id) => {
        const updatedPosts = posts.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                    isLiked: !p.isLiked
                };
            }
            return p;
        });
        setPosts(updatedPosts);
        saveCommunityPosts(updatedPosts);
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    return (
        <MemberSidebar>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-1">Community Loop</h1>
                <p className="text-gray-400">Connect, share, and get inspired by fellow members</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Create Post */}
                    <div className="fitzon-card">
                        <form onSubmit={handlePost}>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-dark border border-neon flex items-center justify-center text-neon font-bold text-sm shrink-0">
                                    {getInitials(currentUser?.name)}
                                </div>
                                <textarea
                                    value={newPost} onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="Share your latest workout milestone..."
                                    className="w-full bg-[#1a1a1a] border border-[#2f2f2f] text-white rounded-xl px-4 py-3 h-24 resize-none focus:outline-none focus:border-neon transition-colors"
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!newPost.trim()}
                                    className="btn-neon text-sm py-2 px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" /> Post
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Feed */}
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="fitzon-card p-0 overflow-hidden group">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-dark border border-[#333] flex items-center justify-center text-neon font-bold">
                                            {getInitials(post.authorName)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white leading-tight">{post.authorName}</h4>
                                            <p className="text-xs text-gray-500">{post.time}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed">{post.text}</p>

                                    <div className="flex items-center gap-6 border-t border-[#1f1f1f] pt-4">
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-neon font-bold' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-neon' : ''}`} />
                                            {post.likes} Likes
                                        </button>
                                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                                            <MessageSquare className="w-4 h-4" /> Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Sidebar - Leaderboard */}
                <div className="space-y-6">
                    <div className="fitzon-card bg-gradient-to-br from-[#1a1a1a] to-[#111] border-neon/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy className="w-24 h-24 text-neon" />
                        </div>

                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Trophy className="w-5 h-5 text-neon" /> Top Members
                        </h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 relative z-10">By Classes Attended</p>

                        <div className="space-y-4 relative z-10">
                            {leaderboard.map((member, index) => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-[#111111] border border-[#1f1f1f] rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="text-xl w-6 text-center">{medals[index]}</div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{member.name}</h4>
                                            <p className="text-xs text-neon">{member.plan}</p>
                                        </div>
                                    </div>
                                    <div className="text-center bg-[#1a1a1a] px-3 py-1 rounded-md border border-[#2f2f2f]">
                                        <span className="font-bebas text-lg text-white block leading-none pt-1">{member.classesAttended}</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Classes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </MemberSidebar>
    );
};

export default Community;
